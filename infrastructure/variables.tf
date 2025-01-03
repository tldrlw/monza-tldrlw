variable "OFF_SEASON" {
  type = bool
  default = false
}

variable "APP_NAME" {
  type    = string
  default = "monza-tldrlw"
}

variable "BLOG_TLDRLW_ALB" {
  type = object({
    arn  = string
    name = string
  })
  default = {
    arn  = "arn:aws:elasticloadbalancing:us-east-1:920394549028:loadbalancer/app/blog-tldrlw/15b9d345a3c0b2df"
    name = "blog-tldrlw"
  }
}

variable "BLOG_TLDRLW_ALB_SG_ID" {
  type    = string
  default = "sg-07507bc51908ada43"
}

variable "BLOG_TLDRLW_ECS_CLUSTER_NAME" {
  type    = string
  default = "main"
}

variable "BLOG_TLDRLW_VPC_ID" {
  type    = string
  default = "vpc-08a677394c24de810"
}

variable "ENV" {
  type    = string
  default = "dev"
  # if "dev" will provision all local testing lambdas in infrastructure/lambda-dev.tf
  # being passed into the ecs service module as env var (value is 'prd' coming from .github/workflows/infrastructure.yaml), but not using it in the next.js app
  # as of 9/30/24, "dvm" also gets passed in from .github/workflows/infrastructure.yaml
}

variable "HOSTNAME" {
  type    = string
  default = "monza.tldrlw.com"
}

variable "IMAGE_TAG" {
  type = string
  # not having a default will force me to provide the latest image tag when running terraform locally
  default = "bcd4997"
  # gets passed in from .github/workflows/infrastructure.yaml
}

variable "LAMBDA_PATH_DEPENDENCIES" {
  type    = string
  default = "lambda/dependencies"
}

variable "LAMBDA_PATH_NO_DEPENDENCIES" {
  type    = string
  default = "lambda/no-dependencies"
}

variable "PRIVATE_APIG_STAGE_NAME" {
  type    = string
  default = "prod"
}

variable "REGION" {
  type    = string
  default = "us-east-1"
}

variable "SVG_LOGOS" {
  type = list(string)
  default = [
    "logo-black.svg",
    "logo-color.svg",
    "logo-no-background.svg",
    "logo-white.svg",
  ]
}

variable "SVG_LOGOS_SOURCE_PATH" {
  default = "/Users/refayathaque/Desktop/tldrlw/tldrlw-logo-zip-file/svg/" # Use the full path to avoid issues with `~`
}

variable "TARGET_GROUP" {
  type = object({
    arn  = string
    name = string
  })
  default = {
    arn  = "arn:aws:elasticloadbalancing:us-east-1:920394549028:targetgroup/monza-tldrlw-tg/85e222105b2d8b48"
    name = "monza-tldrlw-tg"
  }
}

variable "VPN_CIDR" {
  type    = string
  default = "10.1.0.0/22"
}
