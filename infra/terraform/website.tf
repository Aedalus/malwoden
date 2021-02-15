variable "examples_domain" {
  default = "dev.malwoden.com"
}

variable "docs_domain" {
  default = "docs.dev.malwoden.com"
}

variable "acm_arn" {
  default = "arn:aws:acm:us-east-1:838825577048:certificate/ce25a8b1-e28a-4812-bae7-b0052ad8e15c"
}

resource "aws_s3_bucket" "site" {
  bucket = "malwoden-${var.env}"
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "malwoden ${var.env} site"
}

data "aws_route53_zone" "malwoden" {
  name         = "malwoden.com"
  private_zone = false
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.s3_policy.json
}

resource "aws_route53_record" "examples" {
  zone_id = data.aws_route53_zone.malwoden.zone_id
  name    = var.examples_domain
  type    = "A"
  alias {
    evaluate_target_health = true
    name                   = aws_cloudfront_distribution.examples.domain_name
    zone_id                = aws_cloudfront_distribution.examples.hosted_zone_id
  }
}

resource "aws_cloudfront_distribution" "examples" {

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "malwoden - ${var.env} - examples"
  default_root_object = "index.html"

  aliases = [var.examples_domain]

  custom_error_response {
    error_code         = "404"
    response_code      = "200"
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = "403"
    response_code      = "200"
    response_page_path = "/index.html"
  }

  # --- Origins ----------------------------------------------------------------
  origin {
    domain_name = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id   = "examples"
    origin_path = "/examples"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "examples"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.malwoden.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
  }
}


resource "aws_route53_record" "docs" {
  zone_id = data.aws_route53_zone.malwoden.zone_id
  name    = var.docs_domain
  type    = "A"
  alias {
    evaluate_target_health = true
    name                   = aws_cloudfront_distribution.docs.domain_name
    zone_id                = aws_cloudfront_distribution.docs.hosted_zone_id
  }
}

resource "aws_cloudfront_distribution" "docs" {

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "malwoden - ${var.env} - docs"
  default_root_object = "index.html"

  aliases = [var.docs_domain]

  custom_error_response {
    error_code         = "404"
    response_code      = "200"
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = "403"
    response_code      = "200"
    response_page_path = "/index.html"
  }

  # --- Origins ----------------------------------------------------------------
  origin {
    domain_name = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id   = "docs"
    origin_path = "/docs"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }


  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "docs"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  # Cache behavior with precedence 0
  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.malwoden.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
  }
}

# ACM
resource "aws_acm_certificate" "malwoden" {
  domain_name               = var.examples_domain
  subject_alternative_names = [var.docs_domain]
  validation_method         = "DNS"
}

resource "aws_route53_record" "malwoden_dns_validation" {
  for_each = {
    for dvo in aws_acm_certificate.malwoden.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.malwoden.zone_id
}

resource "aws_acm_certificate_validation" "malwoden" {
  certificate_arn         = aws_acm_certificate.malwoden.arn
  validation_record_fqdns = [for record in aws_route53_record.malwoden_dns_validation : record.fqdn]
}
