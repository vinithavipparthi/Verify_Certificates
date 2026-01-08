# AMDOX Certificate Verification System

A web-based system for verifying internship certificates issued by AMDOX. This project allows users to verify their certificates using a unique ID and provides an admin dashboard for managing certificate data.

## Features

- **Certificate Verification**: Users can enter their certificate ID to view and download their internship certificate as a PDF.
- **User Dashboard**: Verified users can access a personal dashboard to view all their certificates with search and filter options.
- **QR Code Generation**: Certificates include QR codes for easy verification scanning.
- **Email Notifications**: Simulated email confirmations for certificate verification.
- **Admin Dashboard**: Secure admin access for bulk uploading student data, editing, deleting, and searching certificates.
- **Certificate Templates**: Multiple customizable templates (Default, Premium, Minimal, Corporate) for different certificate styles.
- **PDF Generation**: Generate professional-looking certificates with html2pdf.js.
- **Responsive Design**: Built with Tailwind CSS for a modern, mobile-friendly interface.

## Project Structure

```
certificate-project/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Custom CSS styles
├── js/
│   └── script.js       # JavaScript logic
├── assets/             # Static assets (images, icons, etc.)
└── README.md           # Project documentation
```

## Setup

1. Clone or download the project files.
2. Open `index.html` in a web browser to run the application.
3. No additional setup required - all dependencies are loaded via CDN.

## Usage

### For Users:
1. Navigate to the "Verification Portal".
2. Enter your certificate ID (e.g., AMD-INT-2026-01).
3. View your certificate details.
4. Download the certificate as a PDF.

### For Admins:
1. Click "Admin Access" and log in with the password "admin123".
2. Use the bulk upload feature to add student data in CSV format.
3. View total certificates issued and system status.

## Technologies Used

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (ES6+)
- html2pdf.js for PDF generation
- Animate.css for animations
- Local Storage for data persistence (simulating MongoDB)

## Future Enhancements

- Backend integration with MongoDB
- User authentication and registration
- Email verification for certificates
- QR code generation for certificates
- Advanced search and filtering
- Certificate templates customization
- API endpoints for external integrations

## Security Note

This is a frontend-only demo. In production, implement proper backend security, database encryption, and secure authentication mechanisms.

## Contributing

Feel free to fork this project and add new features. Pull requests are welcome!

## License

This project is open-source and available under the MIT License.
