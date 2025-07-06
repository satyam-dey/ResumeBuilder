class ResumeBuilder {
  constructor() {
    this.data = {
      personal: {
        fullName: "",
        jobTitle: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        summary: "",
        profileImage: null,
      },
      experience: [],
      education: [],
      skills: [],
    }

    this.currentTemplate = "professional"
    this.zoomLevel = 100

    this.init()
    this.loadFromStorage()
  }

  init() {
    this.bindEvents()
    this.updatePreview()
    this.addInitialItems()
  }

  bindEvents() {
    // Personal information inputs
    const personalInputs = ["fullName", "jobTitle", "email", "phone", "location", "website", "summary"]
    personalInputs.forEach((field) => {
      const input = document.getElementById(field)
      if (input) {
        input.addEventListener("input", (e) => {
          this.data.personal[field] = e.target.value
          this.updatePreview()
          this.saveToStorage()
        })
      }
    })

    // Profile image upload
    document.getElementById("profileImage").addEventListener("change", (e) => {
      this.handleImageUpload(e)
    })

    // Template selector
    document.getElementById("templateSelect").addEventListener("change", (e) => {
      this.currentTemplate = e.target.value
      this.updatePreview()
      this.saveToStorage()
    })

    // Add buttons
    document.getElementById("addExperience").addEventListener("click", () => {
      this.addExperience()
    })

    document.getElementById("addEducation").addEventListener("click", () => {
      this.addEducation()
    })

    document.getElementById("addSkill").addEventListener("click", () => {
      this.addSkill()
    })

    // Zoom controls
    document.getElementById("zoomIn").addEventListener("click", () => {
      this.zoomIn()
    })

    document.getElementById("zoomOut").addEventListener("click", () => {
      this.zoomOut()
    })

    // Download PDF
    document.getElementById("downloadBtn").addEventListener("click", () => {
      this.downloadPDF()
    })

    // Dark mode toggle
    document.getElementById("darkModeToggle").addEventListener("click", () => {
      this.toggleDarkMode()
    })
  }

  handleImageUpload(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.data.personal.profileImage = e.target.result
        this.updateImagePreview()
        this.updatePreview()
        this.saveToStorage()
      }
      reader.readAsDataURL(file)
    }
  }

  updateImagePreview() {
    const preview = document.getElementById("imagePreview")
    if (this.data.personal.profileImage) {
      preview.innerHTML = `<img src="${this.data.personal.profileImage}" alt="Profile">`
      preview.classList.remove("empty")
    } else {
      preview.innerHTML = ""
      preview.classList.add("empty")
    }
  }

  addExperience() {
    const experience = {
      id: Date.now(),
      jobTitle: "",
      company: "",
      duration: "",
      description: "",
    }

    this.data.experience.push(experience)
    this.renderExperienceItem(experience)
    this.updatePreview()
    this.saveToStorage()
  }

  renderExperienceItem(experience) {
    const container = document.getElementById("experienceList")
    const item = document.createElement("div")
    item.className = "dynamic-item"
    item.dataset.id = experience.id

    item.innerHTML = `
            <button type="button" class="remove-btn" onclick="resumeBuilder.removeExperience(${experience.id})">×</button>
            <div class="form-grid">
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" value="${experience.jobTitle}" onchange="resumeBuilder.updateExperience(${experience.id}, 'jobTitle', this.value)">
                </div>
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" value="${experience.company}" onchange="resumeBuilder.updateExperience(${experience.id}, 'company', this.value)">
                </div>
                <div class="form-group">
                    <label>Duration</label>
                    <input type="text" value="${experience.duration}" placeholder="Jan 2020 - Present" onchange="resumeBuilder.updateExperience(${experience.id}, 'duration', this.value)">
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea rows="3" onchange="resumeBuilder.updateExperience(${experience.id}, 'description', this.value)">${experience.description}</textarea>
            </div>
        `

    container.appendChild(item)
  }

  updateExperience(id, field, value) {
    const experience = this.data.experience.find((exp) => exp.id === id)
    if (experience) {
      experience[field] = value
      this.updatePreview()
      this.saveToStorage()
    }
  }

  removeExperience(id) {
    this.data.experience = this.data.experience.filter((exp) => exp.id !== id)
    document.querySelector(`[data-id="${id}"]`).remove()
    this.updatePreview()
    this.saveToStorage()
  }

  addEducation() {
    const education = {
      id: Date.now(),
      school: "",
      degree: "",
      year: "",
      description: "",
    }

    this.data.education.push(education)
    this.renderEducationItem(education)
    this.updatePreview()
    this.saveToStorage()
  }

  renderEducationItem(education) {
    const container = document.getElementById("educationList")
    const item = document.createElement("div")
    item.className = "dynamic-item"
    item.dataset.id = education.id

    item.innerHTML = `
            <button type="button" class="remove-btn" onclick="resumeBuilder.removeEducation(${education.id})">×</button>
            <div class="form-grid">
                <div class="form-group">
                    <label>School/University</label>
                    <input type="text" value="${education.school}" onchange="resumeBuilder.updateEducation(${education.id}, 'school', this.value)">
                </div>
                <div class="form-group">
                    <label>Degree</label>
                    <input type="text" value="${education.degree}" onchange="resumeBuilder.updateEducation(${education.id}, 'degree', this.value)">
                </div>
                <div class="form-group">
                    <label>Year</label>
                    <input type="text" value="${education.year}" placeholder="2020" onchange="resumeBuilder.updateEducation(${education.id}, 'year', this.value)">
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea rows="2" onchange="resumeBuilder.updateEducation(${education.id}, 'description', this.value)">${education.description}</textarea>
            </div>
        `

    container.appendChild(item)
  }

  updateEducation(id, field, value) {
    const education = this.data.education.find((edu) => edu.id === id)
    if (education) {
      education[field] = value
      this.updatePreview()
      this.saveToStorage()
    }
  }

  removeEducation(id) {
    this.data.education = this.data.education.filter((edu) => edu.id !== id)
    document.querySelector(`[data-id="${id}"]`).remove()
    this.updatePreview()
    this.saveToStorage()
  }

  addSkill() {
    const skillInput = prompt("Enter a skill:")
    if (skillInput && skillInput.trim()) {
      const skill = {
        id: Date.now(),
        name: skillInput.trim(),
      }

      this.data.skills.push(skill)
      this.renderSkillItem(skill)
      this.updatePreview()
      this.saveToStorage()
    }
  }

  renderSkillItem(skill) {
    const container = document.getElementById("skillsList")
    const item = document.createElement("div")
    item.className = "skill-item"
    item.dataset.id = skill.id

    item.innerHTML = `
            ${skill.name}
            <button type="button" class="remove-skill" onclick="resumeBuilder.removeSkill(${skill.id})">×</button>
        `

    container.appendChild(item)
  }

  removeSkill(id) {
    this.data.skills = this.data.skills.filter((skill) => skill.id !== id)
    document.querySelector(`[data-id="${id}"]`).remove()
    this.updatePreview()
    this.saveToStorage()
  }

  updatePreview() {
    const preview = document.getElementById("resumePreview")
    preview.className = `resume-preview ${this.currentTemplate}-template`

    switch (this.currentTemplate) {
      case "professional":
        preview.innerHTML = this.generateProfessionalTemplate()
        break
      case "creative":
        preview.innerHTML = this.generateCreativeTemplate()
        break
      case "classic":
        preview.innerHTML = this.generateClassicTemplate()
        break
      case "elegant":
        preview.innerHTML = this.generateElegantTemplate()
        break
    }

    preview.classList.add("fade-in")
    setTimeout(() => preview.classList.remove("fade-in"), 500)
  }

  generateProfessionalTemplate() {
    const { personal, experience, education, skills } = this.data

    return `
            <div class="resume-header">
                ${personal.profileImage ? `<div class="profile-image"><img src="${personal.profileImage}" alt="Profile"></div>` : ""}
                <h1 class="name">${personal.fullName || "Your Name"}</h1>
                <p class="job-title">${personal.jobTitle || "Your Job Title"}</p>
                <div class="contact-info">
                    ${personal.email ? `<span>📧 ${personal.email}</span>` : ""}
                    ${personal.phone ? `<span>📞 ${personal.phone}</span>` : ""}
                    ${personal.location ? `<span>📍 ${personal.location}</span>` : ""}
                    ${personal.website ? `<span>🌐 ${personal.website}</span>` : ""}
                </div>
            </div>
            <div class="resume-body">
                ${
                  personal.summary
                    ? `
                    <div class="section">
                        <h2 class="section-title">Professional Summary</h2>
                        <p class="summary">${personal.summary}</p>
                    </div>
                `
                    : ""
                }
                
                ${
                  experience.length > 0
                    ? `
                    <div class="section">
                        <h2 class="section-title">Experience</h2>
                        ${experience
                          .map(
                            (exp) => `
                            <div class="experience-item">
                                <div class="item-header">
                                    <div>
                                        <div class="item-title">${exp.jobTitle || "Job Title"}</div>
                                        <div class="item-company">${exp.company || "Company Name"}</div>
                                    </div>
                                    <div class="item-duration">${exp.duration || "Duration"}</div>
                                </div>
                                ${exp.description ? `<p class="item-description">${exp.description}</p>` : ""}
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
                
                ${
                  education.length > 0
                    ? `
                    <div class="section">
                        <h2 class="section-title">Education</h2>
                        ${education
                          .map(
                            (edu) => `
                            <div class="education-item">
                                <div class="item-header">
                                    <div>
                                        <div class="item-title">${edu.degree || "Degree"}</div>
                                        <div class="item-company">${edu.school || "School Name"}</div>
                                    </div>
                                    <div class="item-duration">${edu.year || "Year"}</div>
                                </div>
                                ${edu.description ? `<p class="item-description">${edu.description}</p>` : ""}
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
                
                ${
                  skills.length > 0
                    ? `
                    <div class="section">
                        <h2 class="section-title">Skills</h2>
                        <div class="skills-grid">
                            ${skills.map((skill) => `<div class="skill-item">${skill.name}</div>`).join("")}
                        </div>
                    </div>
                `
                    : ""
                }
            </div>
        `
  }

  generateCreativeTemplate() {
    const { personal, experience, education, skills } = this.data

    return `
            <div class="resume-header">
                ${personal.profileImage ? `<div class="profile-image"><img src="${personal.profileImage}" alt="Profile"></div>` : ""}
                <div class="header-content">
                    <h1 class="name">${personal.fullName || "Your Name"}</h1>
                    <p class="job-title">${personal.jobTitle || "Your Job Title"}</p>
                    <div class="contact-info">
                        ${personal.email ? `<span>📧 ${personal.email}</span>` : ""}
                        ${personal.phone ? `<span>📞 ${personal.phone}</span>` : ""}
                        ${personal.location ? `<span>📍 ${personal.location}</span>` : ""}
                        ${personal.website ? `<span>🌐 ${personal.website}</span>` : ""}
                    </div>
                </div>
            </div>
            <div class="resume-body">
                ${
                  personal.summary
                    ? `
                    <div class="section">
                        <h2 class="section-title">About Me</h2>
                        <p class="summary">${personal.summary}</p>
                    </div>
                `
                    : ""
                }
                
                ${
                  experience.length > 0
                    ? `
                    <div class="section">
                        <h2 class="section-title">Experience</h2>
                        ${experience
                          .map(
                            (exp) => `
                            <div class="experience-item">
                                <div class="item-header">
                                    <div>
                                        <div class="item-title">${exp.jobTitle || "Job Title"}</div>
                                        <div class="item-company">${exp.company || "Company Name"}</div>
                                    </div>
                                    <div class="item-duration">${exp.duration || "Duration"}</div>
                                </div>
                                ${exp.description ? `<p class="item-description">${exp.description}</p>` : ""}
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
                
                ${
                  education.length > 0
                    ? `
                    <div class="section">
                        <h2 class="section-title">Education</h2>
                        ${education
                          .map(
                            (edu) => `
                            <div class="education-item">
                                <div class="item-header">
                                    <div>
                                        <div class="item-title">${edu.degree || "Degree"}</div>
                                        <div class="item-company">${edu.school || "School Name"}</div>
                                    </div>
                                    <div class="item-duration">${edu.year || "Year"}</div>
                                </div>
                                ${edu.description ? `<p class="item-description">${edu.description}</p>` : ""}
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
                
                ${
                  skills.length > 0
                    ? `
                    <div class="section">
                        <h2 class="section-title">Skills</h2>
                        <div class="skills-grid">
                            ${skills.map((skill) => `<div class="skill-item">${skill.name}</div>`).join("")}
                        </div>
                    </div>
                `
                    : ""
                }
            </div>
        `
  }

  generateClassicTemplate() {
    const { personal, experience, education, skills } = this.data

    return `
            <div class="sidebar">
                <div class="profile-section">
                    ${personal.profileImage ? `<div class="profile-image"><img src="${personal.profileImage}" alt="Profile"></div>` : ""}
                    <h1 class="name">${personal.fullName || "Your Name"}</h1>
                    <p class="job-title">${personal.jobTitle || "Your Job Title"}</p>
                </div>
                
                <div class="section">
                    <h3 class="section-title">Contact</h3>
                    <div class="contact-info">
                        ${personal.email ? `<span>📧 ${personal.email}</span>` : ""}
                        ${personal.phone ? `<span>📞 ${personal.phone}</span>` : ""}
                        ${personal.location ? `<span>📍 ${personal.location}</span>` : ""}
                        ${personal.website ? `<span>🌐 ${personal.website}</span>` : ""}
                    </div>
                </div>
                
                ${
                  skills.length > 0
                    ? `
                    <div class="section">
                        <h3 class="section-title">Skills</h3>
                        <div class="skills-list">
                            ${skills.map((skill) => `<div class="skill-item">${skill.name}</div>`).join("")}
                        </div>
                    </div>
                `
                    : ""
                }
            </div>
            
            <div class="main-content">
                ${
                  personal.summary
                    ? `
                    <div class="section">
                        <h2 class="section-title">Professional Summary</h2>
                        <p class="summary">${personal.summary}</p>
                    </div>
                `
                    : ""
                }
                
                ${
                  experience.length > 0
                    ? `
                    <div class="section">
                        <h2 class="section-title">Experience</h2>
                        ${experience
                          .map(
                            (exp) => `
                            <div class="experience-item">
                                <div class="item-header">
                                    <div>
                                        <div class="item-title">${exp.jobTitle || "Job Title"}</div>
                                        <div class="item-company">${exp.company || "Company Name"}</div>
                                    </div>
                                    <div class="item-duration">${exp.duration || "Duration"}</div>
                                </div>
                                ${exp.description ? `<p class="item-description">${exp.description}</p>` : ""}
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
                
                ${
                  education.length > 0
                    ? `
                    <div class="section">
                        <h2 class="section-title">Education</h2>
                        ${education
                          .map(
                            (edu) => `
                            <div class="education-item">
                                <div class="item-header">
                                    <div>
                                        <div class="item-title">${edu.degree || "Degree"}</div>
                                        <div class="item-company">${edu.school || "School Name"}</div>
                                    </div>
                                    <div class="item-duration">${edu.year || "Year"}</div>
                                </div>
                                ${edu.description ? `<p class="item-description">${edu.description}</p>` : ""}
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
            </div>
        `
  }

  generateElegantTemplate() {
    const { personal, experience, education, skills } = this.data

    return `
            <div class="resume-header">
                ${personal.profileImage ? `<div class="profile-image"><img src="${personal.profileImage}" alt="Profile"></div>` : ""}
                <h1 class="name">${personal.fullName || "Your Name"}</h1>
                <p class="job-title">${personal.jobTitle || "Your Job Title"}</p>
                <div class="contact-info">
                    ${personal.email ? `<span>${personal.email}</span>` : ""}
                    ${personal.phone ? `<span>${personal.phone}</span>` : ""}
                    ${personal.location ? `<span>${personal.location}</span>` : ""}
                    ${personal.website ? `<span>${personal.website}</span>` : ""}
                </div>
            </div>
            <div class="resume-body">
                ${
                  personal.summary
                    ? `
                    <div class="section">
                        <h2 class="section-title">About</h2>
                        <p class="summary">${personal.summary}</p>
                    </div>
                `
                    : ""
                }
                
                ${
                  experience.length > 0
                    ? `
                    <div class="section">
                        <h2 class="section-title">Experience</h2>
                        ${experience
                          .map(
                            (exp) => `
                            <div class="experience-item">
                                <div class="item-title">${exp.jobTitle || "Job Title"}</div>
                                <div class="item-company">${exp.company || "Company Name"}</div>
                                <div class="item-duration">${exp.duration || "Duration"}</div>
                                ${exp.description ? `<p class="item-description">${exp.description}</p>` : ""}
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
                
                ${
                  education.length > 0
                    ? `
                    <div class="section">
                        <h2 class="section-title">Education</h2>
                        ${education
                          .map(
                            (edu) => `
                            <div class="education-item">
                                <div class="item-title">${edu.degree || "Degree"}</div>
                                <div class="item-company">${edu.school || "School Name"}</div>
                                <div class="item-duration">${edu.year || "Year"}</div>
                                ${edu.description ? `<p class="item-description">${edu.description}</p>` : ""}
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
                
                ${
                  skills.length > 0
                    ? `
                    <div class="section">
                        <h2 class="section-title">Skills</h2>
                        <div class="skills-grid">
                            ${skills.map((skill) => `<div class="skill-item">${skill.name}</div>`).join("")}
                        </div>
                    </div>
                `
                    : ""
                }
            </div>
        `
  }

  zoomIn() {
    if (this.zoomLevel < 150) {
      this.zoomLevel += 10
      this.updateZoom()
    }
  }

  zoomOut() {
    if (this.zoomLevel > 50) {
      this.zoomLevel -= 10
      this.updateZoom()
    }
  }

  updateZoom() {
    const preview = document.getElementById("resumePreview")
    preview.style.transform = `scale(${this.zoomLevel / 100})`
    document.getElementById("zoomLevel").textContent = `${this.zoomLevel}%`
  }

  downloadPDF() {
    // Hide UI elements for printing
    document.body.classList.add("printing")

    // Use browser's print functionality
    window.print()

    // Restore UI elements after printing
    setTimeout(() => {
      document.body.classList.remove("printing")
    }, 1000)
  }

  toggleDarkMode() {
    const body = document.body
    const isDark = body.dataset.theme === "dark"

    if (isDark) {
      body.removeAttribute("data-theme")
      document.getElementById("darkModeToggle").innerHTML = '<span class="icon">🌙</span>'
    } else {
      body.dataset.theme = "dark"
      document.getElementById("darkModeToggle").innerHTML = '<span class="icon">☀️</span>'
    }

    localStorage.setItem("darkMode", !isDark)
  }

  saveToStorage() {
    const dataToSave = {
      ...this.data,
      currentTemplate: this.currentTemplate,
    }
    localStorage.setItem("resumeBuilderData", JSON.stringify(dataToSave))
  }

  loadFromStorage() {
    const saved = localStorage.getItem("resumeBuilderData")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        this.data = { ...this.data, ...data }
        this.currentTemplate = data.currentTemplate || "professional"

        // Populate form fields
        Object.keys(this.data.personal).forEach((key) => {
          const input = document.getElementById(key)
          if (input && key !== "profileImage") {
            input.value = this.data.personal[key] || ""
          }
        })

        // Set template selector
        document.getElementById("templateSelect").value = this.currentTemplate

        // Render dynamic items
        this.data.experience.forEach((exp) => this.renderExperienceItem(exp))
        this.data.education.forEach((edu) => this.renderEducationItem(edu))
        this.data.skills.forEach((skill) => this.renderSkillItem(skill))

        // Update image preview
        this.updateImagePreview()

        // Update preview
        this.updatePreview()
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }

    // Load dark mode preference
    const darkMode = localStorage.getItem("darkMode") === "true"
    if (darkMode) {
      this.toggleDarkMode()
    }
  }

  addInitialItems() {
    // Add one initial experience and education item
    if (this.data.experience.length === 0) {
      this.addExperience()
    }
    if (this.data.education.length === 0) {
      this.addEducation()
    }
  }
}

// Initialize the resume builder when the page loads
let resumeBuilder
document.addEventListener("DOMContentLoaded", () => {
  resumeBuilder = new ResumeBuilder()
})

// Add CSS for printing state
const printStyles = `
    .printing .app-header,
    .printing .input-panel,
    .printing .preview-header {
        display: none !important;
    }
    
    .printing .main-content {
        display: block !important;
        grid-template-columns: none !important;
        padding: 0 !important;
        margin: 0 !important;
        max-width: none !important;
    }
    
    .printing .preview-panel {
        box-shadow: none !important;
        border-radius: 0 !important;
        background: white !important;
    }
    
    .printing .preview-container {
        padding: 0 !important;
        background: white !important;
        display: block !important;
    }
    
    .printing .resume-preview {
        width: 100% !important;
        min-height: auto !important;
        box-shadow: none !important;
        margin: 0 !important;
        transform: none !important;
    }
`

// Add print styles to document
const styleSheet = document.createElement("style")
styleSheet.textContent = printStyles
document.head.appendChild(styleSheet)
