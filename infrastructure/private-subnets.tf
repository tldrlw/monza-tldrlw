### for λs in VPC ###
# NAT Gateway in a Public Subnet
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = data.aws_subnets.blog_tldrlw.ids[0]
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/nat_gateway

# Elastic IP for the NAT Gateway
resource "aws_eip" "nat" {
  domain = "vpc"
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eip

# Private Subnets
resource "aws_subnet" "private" {
  count                   = 3
  vpc_id                  = var.BLOG_TLDRLW_VPC_ID
  cidr_block              = "10.0.${count.index + 10}.0/24" # Example CIDR blocks for private subnets
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = false
  tags = {
    Name = "private-${var.APP_NAME}-${data.aws_availability_zones.available.names[count.index]}"
  }
}

# Route Table for Private Subnets
resource "aws_route_table" "private" {
  vpc_id = var.BLOG_TLDRLW_VPC_ID
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }
}

# Associate Private Subnets with Private Route Table
resource "aws_route_table_association" "private" {
  count          = 3
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}
### for λs in VPC ###
