resource "aws_route53_record" "www_monza" {
  count   = var.OFF_SEASON ? 0 : 1
  zone_id = data.aws_route53_zone.tldrlw_com.zone_id
  name    = "www.monza"
  # will show up in management console Route 53 as 'www.monza.tldrlw.com'
  type = "A"
  alias {
    name                   = data.aws_lb.blog_tldrlw.dns_name
    zone_id                = data.aws_lb.blog_tldrlw.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "monza" {
  count   = var.OFF_SEASON ? 0 : 1
  zone_id = data.aws_route53_zone.tldrlw_com.zone_id
  name    = "monza"
  # will show up in management console Route 53 as 'monza.tldrlw.com'
  type = "A"
  alias {
    name                   = data.aws_lb.blog_tldrlw.dns_name
    zone_id                = data.aws_lb.blog_tldrlw.zone_id
    evaluate_target_health = true
  }
}

# deployed during off-season
resource "aws_route53_record" "www_monza_cdn" {
  count   = var.OFF_SEASON ? 1 : 0
  zone_id = data.aws_route53_zone.tldrlw_com.zone_id
  name    = "www.monza"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "monza_cdn" {
  count   = var.OFF_SEASON ? 1 : 0
  zone_id = data.aws_route53_zone.tldrlw_com.zone_id
  name    = "monza"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}
