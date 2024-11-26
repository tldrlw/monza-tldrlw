resource "aws_route53_record" "www_monza" {
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
