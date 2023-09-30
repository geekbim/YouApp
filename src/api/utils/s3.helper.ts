import { Inject } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export class S3Service {
    private readonly bucketName: string;
    private readonly accessKey: string;
    private readonly secretKey: string;
    private readonly regionName: string;

    constructor(@Inject(ConfigService) config: ConfigService) {
        this.bucketName = config.get('AWS_BUCKET_NAME');
        this.accessKey = config.get('AWS_ACCESS_KEY');
        this.secretKey = config.get('AWS_SECRET_KEY');
        this.regionName = config.get('AWS_REGION_NAME');
    };

    async uploadBase64Image(base64Image: string): Promise<string> {
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        const key = `${Date.now().toString()}-${Math.random().toString(36).substring(2)}.jpg`;

        const s3Client = new S3Client({
            region: this.regionName,
            credentials: {
              accessKeyId: this.accessKey,
              secretAccessKey: this.secretKey,
            },
        });

        const params = {
            Bucket: this.bucketName,
            Key: key,
            Body: imageBuffer,
            ACL: 'public-read',
        };
    
        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        // Return the file location
        const fileLocation = `https://${this.bucketName}.s3.amazonaws.com/${key}`;
        return fileLocation;
    }
}