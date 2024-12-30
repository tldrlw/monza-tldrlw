# route-53.tf has config pointing to this during off-season
resource "aws_s3_bucket_public_access_block" "static_website" {
  bucket                  = aws_s3_bucket.static_website.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket" "static_website" {
  bucket = "monza.tldrlw.com"
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.static_website.id
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_policy" "static_website_policy" {
  bucket = aws_s3_bucket.static_website.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.static_website.arn}/*"
      }
    ]
  })
  depends_on = [aws_s3_bucket_public_access_block.static_website]
}
# http://monza.tldrlw.com.s3-website-us-east-1.amazonaws.com/

resource "aws_s3_object" "index_html" {
  bucket       = aws_s3_bucket.static_website.bucket
  key          = "index.html"
  source       = "${path.module}/off-season-html/index.html"
  content_type = "text/html"
  etag         = filemd5("${path.module}/off-season-html/index.html") # Track changes to the file
}

resource "aws_s3_object" "error_html" {
  bucket       = aws_s3_bucket.static_website.bucket
  key          = "error.html"
  source       = "${path.module}/off-season-html/error.html"
  content_type = "text/html"
  etag         = filemd5("${path.module}/off-season-html/error.html") # Track changes to the file
}
