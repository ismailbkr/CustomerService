# Customer Service AI Assistant

## Environment Setup

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Copy the example environment file:
```bash
cp .env.example .env.local
```

3. Update the `.env.local` file with your actual API Gateway URL

### Backend Setup
1. Navigate to the backend Lambda directory:
```bash
cd backend/CustomerService/lambda/chat
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your actual AWS configurations:
- MYAWS_REGION: Your AWS region
- S3_BUCKET_NAME: Your S3 bucket name
- S3JsonKey: Path to your AI responses JSON file
- SimilarityThreshold: Threshold for response matching

## Important Security Notes
- Never commit `.env` files to the repository
- Always use `.env.example` files as templates
- Keep your AWS credentials and sensitive information secure
- Use AWS IAM roles and policies for Lambda functions instead of hardcoded credentials 