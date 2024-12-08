package trivy

default ignore = false

ignore {
    input.Target == "node-pkg"
    input.VulnerabilityID == "CVE-2024-21538"
}