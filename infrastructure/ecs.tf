module "ecs_service" {
  source                      = "git::https://github.com/tldrlw/terraform-modules.git//ecs-service"
  app_name                    = var.APP_NAME
  ecr_repo_url                = aws_ecr_repository.main.repository_url
  image_tag                   = var.IMAGE_TAG
  ecs_cluster_id              = data.aws_ecs_cluster.blog_tldrlw.id
  task_count                  = 1
  alb_target_group_arn        = data.aws_lb_target_group.main.arn
  source_security_group_id    = data.aws_security_group.blog_tldrlw_alb.id
  security_group_egress_cidrs = ["0.0.0.0/0"]
  subnets                     = data.aws_subnets.blog_tldrlw.ids
  vpc_id                      = data.aws_vpc.blog_tldrlw.id
  container_port              = 3000
  host_port                   = 3000
  # cpu                         = "512"
  # memory                      = "1024"
}
# rm -rf .terraform/modules > terraform init
# run ^ after pushing up changes to modules when testing locally

# ALB managed in blog-tldrlw repo, that ALB module instantiation also created a seperate listener and target group for this app
# ECS cluster also being managed in blog-tldrlw repo
