resource "aws_s3_bucket_public_access_block" "images" {
  bucket                  = aws_s3_bucket.images.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
# The error you’re seeing (AccessDenied: User is not authorized to perform: s3:PutBucketPolicy on resource... because public policies are blocked by the BlockPublicPolicy block public access setting.) is due to the S3 Block Public Access settings, which are preventing public policies from being applied to the bucket.
# Solution: Modify the Bucket’s Public Access Block
# You need to disable the Block Public Access settings that prevent public bucket policies from being applied. This can be done using the aws_s3_bucket_public_access_block resource in Terraform.

resource "aws_s3_bucket" "images" {
  bucket        = "${var.APP_NAME}-images"
  force_destroy = true # Allow the deletion of the bucket if necessary
  tags = {
    Name = "${var.APP_NAME}-images"
  }
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket

resource "aws_s3_bucket_versioning" "images" {
  bucket = aws_s3_bucket.images.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_policy" "images" {
  bucket = aws_s3_bucket.images.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.images.arn}/*"
      }
    ]
  })
  depends_on = [aws_s3_bucket_public_access_block.images]
}

variable "svg_logos" {
  type = list(string)
  default = [
    "logo-black.svg",
    "logo-color.svg",
    "logo-no-background.svg",
    "logo-white.svg",
  ]
}

variable "svg_logos_source_path" {
  default = "/Users/refayathaque/Desktop/tldrlw/tldrlw-logo-zip-file/svg/" # Use the full path to avoid issues with `~`
}

resource "aws_s3_bucket_cors_configuration" "images" {
  bucket = aws_s3_bucket.images.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["https://monza.tldrlw.com", "https://blog.tldrlw.com", "http://localhost:3000"] # Restricting to prod deployments and local dev testing
    expose_headers  = []
    max_age_seconds = 3000
  }
}
# CORS (Cross-Origin Resource Sharing) settings are essential for allowing browsers to access your S3-hosted images when they are fetched from your domain (https://monza.tldrlw.com). If the CORS configuration is missing or incorrect, you might encounter issues when loading images from your S3 bucket in the browser, especially when making cross-origin requests from different domains or subdomains. CORS ensures that browsers are allowed to fetch resources (like images) from your S3 bucket, specifically for cross-origin requests. Since your images are being hosted on S3 and served on monza.tldrlw.com, it’s important that the S3 bucket allows requests from that domain.

resource "aws_s3_object" "svg_logos" {
  for_each     = toset(var.svg_logos) # Convert list to set for for_each
  bucket       = aws_s3_bucket.images.bucket
  key          = "logos/${each.value}"                       # Destination key in S3
  source       = "${var.svg_logos_source_path}${each.value}" # Source file path
  content_type = "image/svg+xml"                             # Set Content-Type for SVG
  metadata = {
    "cache-control" = "public, max-age=31536000, immutable"
  }
}
# Cache-control headers are crucial for ensuring efficient caching of your images. By setting these headers, you instruct browsers and any CDN (if you use one) on how long they should cache the images before re-fetching them. This reduces the load on your S3 bucket and speeds up image delivery to end-users.
# max-age=31536000 (1 year): This ensures that the browser caches the images for a year, improving performance and reducing unnecessary image requests.
# immutable: This tells the browser that the file will never change, so it can skip cache revalidation.

