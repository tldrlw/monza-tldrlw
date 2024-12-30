locals {
  s3_website_endpoint = "${aws_s3_bucket.static_website.bucket}.s3-website-${data.aws_region.current.name}.amazonaws.com"
}

resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = local.s3_website_endpoint
    origin_id   = "S3-monza-static"
    custom_origin_config {
      origin_protocol_policy = "http-only" # S3 website endpoint does not support HTTPS
      http_port              = 80
      https_port             = 443
      origin_ssl_protocols   = ["TLSv1.2", "TLSv1.1"] # Specify allowed SSL protocols
    }
  }
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = ["monza.tldrlw.com"] # Add your domain here
  default_cache_behavior {
    target_origin_id         = "S3-monza-static"
    viewer_protocol_policy   = "redirect-to-https" # Redirect HTTP to HTTPS
    allowed_methods          = ["GET", "HEAD", "OPTIONS"]
    cached_methods           = ["GET", "HEAD"]
    cache_policy_id          = "658327ea-f89d-4fab-a63d-7e88639e58f6" # AWS's managed Cache Policy (CachingOptimized)
    origin_request_policy_id = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf" # AWS's managed Origin Request Policy (CORS-S3Origin)
  }
  viewer_certificate {
    acm_certificate_arn      = data.aws_acm_certificate.monza_tldrlw_com.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  tags = {
    Environment = "Production"
  }
}
