# Webhook Data Format - VoiceFlow Builder

## Overview
This document describes the data structure sent to your n8n webhook when a voice assistant is created through the VoiceFlow Builder form.

## Webhook URL
```
https://builderbid.app.n8n.cloud/webhook/vapi-create-assistant
```

## HTTP Method
`POST`

## Content-Type
`multipart/form-data`

## Data Structure

### FormData Format ✨
The webhook now receives data as **actual FormData** (multipart/form-data) with the following fields:

```
formData: "{\"companyName\":\"TechFlow Solutions\",\"companyWebsite\":\"https://techflowsolutions.com\",...}"
fileCount: "2"
fileMetadata_0: "{\"originalName\":\"company-faq.pdf\",\"size\":245760,\"type\":\"application/pdf\",\"lastModified\":1703123456789}"
fileContent_0: "data:application/pdf;base64,JVBERi0xLjQKJdPz5NeFJhc...[full base64 content]"
fileBase64_0: "JVBERi0xLjQKJdPz5NeFJhc...[base64 data only]"
fileMetadata_1: "{\"originalName\":\"service-policies.docx\",\"size\":156432,\"type\":\"application/vnd.openxmlformats-officedocument.wordprocessingml.document\",\"lastModified\":1703123456790}"
fileContent_1: "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQABgAI...[full base64 content]"
fileBase64_1: "UEsDBBQABgAI...[base64 data only]"
```

### FormData Structure

#### 1. `formData` (FormData field)
Stringified JSON containing all form fields:

**When parsed, contains:**
- **Company Information**: companyName, companyWebsite, phoneNumber, contactEmail, industry, description, services, targetAudience, companySize, location
- **Company Policies**: refundPolicy, serviceGuarantees, companyPolicies  
- **Social Media**: facebookUrl, linkedinUrl, twitterUrl, instagramUrl, otherSocialMedia
- **Additional Info**: additionalInfo
- **Assistant Config**: assistantName, personality, language, workingHours, workingDays
- **Knowledge Base**: frequentQuestions, commonRestrictions, customRestrictions, confidentialityLevel
- **Integration**: calendarEmail, webhookUrl, appointmentDuration, bufferTime, calendarIntegration
- **Metadata**: submittedAt, totalFiles, totalFileSize, note

#### 2. `fileCount` (FormData field)
Number of uploaded files as a string

#### 3. File Data (Multiple FormData fields per file)
For each file with index `i`:

- `fileMetadata_i`: Stringified JSON with file metadata
- `fileContent_i`: Base64 data with data URL prefix (ready for direct use)
- `fileBase64_i`: Raw base64 encoded binary data (for processing)

### Processing in n8n

#### Access FormData Fields
```javascript
// In n8n, FormData fields are accessible directly from $json
const formData = JSON.parse($json.formData);
const fileCount = parseInt($json.fileCount);

console.log('Company Name:', formData.companyName);
console.log('Assistant Name:', formData.assistantName);
console.log('File Count:', fileCount);
```

#### Process Files
```javascript
const fileCount = parseInt($json.fileCount);

for (let i = 0; i < fileCount; i++) {
  // Parse file metadata
  const metadata = JSON.parse($json[`fileMetadata_${i}`]);
  
  // Get file content (ready to use data URL)
  const fileDataUrl = $json[`fileContent_${i}`];
  
  // Get raw base64 data for processing
  const base64Data = $json[`fileBase64_${i}`];
  
  console.log(`File ${i}:`, {
    name: metadata.originalName,
    size: metadata.size,
    type: metadata.type,
    hasContent: !!fileDataUrl,
    base64Length: base64Data.length
  });
  
  // Convert to binary if needed
  const binaryBuffer = Buffer.from(base64Data, 'base64');
  
  // Save or process the file
  await saveFile(metadata.originalName, binaryBuffer, metadata.type);
}
```

#### Example n8n Code Node
```javascript
// Parse form data from FormData field
const form = JSON.parse($json.formData);
const fileCount = parseInt($json.fileCount);

// Extract files from FormData fields
const files = [];
for (let i = 0; i < fileCount; i++) {
  const metadata = JSON.parse($json[`fileMetadata_${i}`]);
  const content = $json[`fileContent_${i}`];
  const base64 = $json[`fileBase64_${i}`];
  
  files.push({
    name: metadata.originalName,
    size: metadata.size,
    type: metadata.type,
    lastModified: metadata.lastModified,
    content: content,
    base64: base64,
    buffer: Buffer.from(base64, 'base64')
  });
}

return {
  companyData: {
    name: form.companyName,
    website: form.companyWebsite,
    email: form.contactEmail,
    phone: form.phoneNumber,
    industry: form.industry
  },
  assistantConfig: {
    name: form.assistantName,
    personality: form.personality,
    language: form.language,
    workingHours: form.workingHours,
    workingDays: form.workingDays
  },
  knowledgeBase: {
    faqs: form.frequentQuestions,
    restrictions: form.commonRestrictions,
    customRestrictions: form.customRestrictions,
    confidentiality: form.confidentialityLevel,
    files: files
  },
  integration: {
    calendarEmail: form.calendarEmail,
    appointmentDuration: form.appointmentDuration,
    bufferTime: form.bufferTime,
    calendarIntegration: form.calendarIntegration
  },
  metadata: {
    submittedAt: form.submittedAt,
    totalFiles: fileCount,
    totalFileSize: form.totalFileSize
  }
};
```

## File Processing Options

### Option 1: Use `fileContent_i` for direct storage
```javascript
// Perfect for databases that support data URLs
const fileDataUrl = $json.fileContent_0;
// Store directly: "data:application/pdf;base64,JVBERi0x..."
```

### Option 2: Use `fileBase64_i` for binary processing
```javascript
// Convert to binary for file system storage
const base64Data = $json.fileBase64_0;
const buffer = Buffer.from(base64Data, 'base64');
fs.writeFileSync('document.pdf', buffer);
```

### Option 3: Parse metadata for file handling
```javascript
const metadata = JSON.parse($json.fileMetadata_0);
const fileName = metadata.originalName;
const fileType = metadata.type;
const fileSize = metadata.size;

// Use metadata for validation, naming, etc.
if (fileType === 'application/pdf') {
  // Handle PDF specifically
}
```

## Error Handling

The webhook should respond with:
- **200 OK**: Successful processing
- **400 Bad Request**: Invalid data format
- **500 Internal Server Error**: Processing error

## Security Notes

1. Data is sent as multipart/form-data (standard web form format)
2. Files are base64 encoded for safe transport
3. URLs and emails are pre-validated
4. File size limits: 10MB per file
5. Supported file types: PDF, DOCX, TXT

## Key Benefits of FormData Format

1. **Native web standard**: Standard multipart/form-data format
2. **n8n compatible**: Works seamlessly with n8n form handling
3. **Easy access**: Direct field access via `$json.fieldName`
4. **Flexible file handling**: Multiple format options per file
5. **Better debugging**: Clear field names in n8n interface

## FormData Field Summary

| Field Pattern | Description | Example |
|---------------|-------------|---------|
| `formData` | All form data as JSON string | `"{\"companyName\":\"TechFlow\",...}"` |
| `fileCount` | Number of files | `"2"` |
| `fileMetadata_i` | File metadata as JSON | `"{\"originalName\":\"doc.pdf\",...}"` |
| `fileContent_i` | Full data URL | `"data:application/pdf;base64,..."` |
| `fileBase64_i` | Raw base64 data | `"JVBERi0xLjQK..."` |
| `fileError_i` | Error message (if any) | `"Failed to process file"` | 