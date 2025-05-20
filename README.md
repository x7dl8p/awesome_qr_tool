# The QR Tool

A modern, multilingual QR code tool that allows you to read, generate, and manage QR codes directly in your browser. Built with Next.js and TypeScript.

![The QR Tool Preview](public/placeholder-logo.png)

## Features

- QR Code Reading: Upload, paste, or drag & drop QR code images
- QR Code Generation: Create QR codes for text, URLs, and more
- Multilingual Support:
  - English (EN)
  - Arabic (AR)
  - Spanish (ES)
  - French (FR)
  - German (DE)
  - Chinese (ZH)
- Mobile Friendly: Responsive design that works on all devices
- History Management: Keep track of your scanned QR codes
- Privacy First: All processing happens in your browser
- No Installation: Works directly in your web browser

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/x7dl8p/theQrTool.git
cd theQrTool
```

2. Install dependencies:
```bash
yarn install
```

3. Run the development server:
```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Built With

- Next.js - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Shadcn/ui - UI components
- jsQR - QR code reading
- qrcode.react - QR code generation

## Key Features

### QR Code Reader
- Multiple input methods (upload, paste, drag & drop)
- Support for various image formats (SVG, PNG, JPG, GIF)
- History tracking of scanned codes
- One-click copy of decoded content
- Direct URL opening for web links

### QR Code Generator
- Real-time QR code generation
- High-quality image output
- Easy download in PNG format
- Support for text and URLs

### History Management
- Persistent storage of scanned QR codes
- Quick access to previous scans
- Easy deletion of history items
- Copy and open functionalities

## Contributing

Contributions are welcome. Feel free to submit issues and pull requests.

## License

This project is MIT licensed - see the LICENSE file for details.