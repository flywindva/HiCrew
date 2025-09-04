# HiCrew - Virtual Airline System (Frontend)

HiCrew is a complete virtual airline system designed for flight simulators. This repository contains the **frontend** of the application, built with React.

## 🌟 Features

- **Complete virtual airline system** with pilot, fleet, route, and flight management
- **Multi-language support** (ES, EN, FR, PT, IT, CA, EU, GL)
- **HiACARS integration** for automatic flight tracking
- **Complete administration panel**
- **Role and permission system**
- **Detailed statistics and reports**
- **Responsive and modern design**

## 🚀 Quick Setup

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- HiCrew Backend running ([HiCrewBackend](https://github.com/alejandro-diazro/HiCrewBackend))

### Configuration

1. **Clone this repository:**
   ```bash
   git clone https://github.com/alejandro-diazro/HiCrew.git
   cd HiCrew
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure your airline by editing the `src/config.jsx` file:**
   - Change your airline name
   - Configure your backend URL
   - Customize translations
   - Adjust other parameters as needed

4. **Customize images in `public/resources/`:**
   - Your airline logo
   - Banners and backgrounds
   - Icons and other graphic resources

5. **Start the development server:**
   ```bash
   npm start
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

## ⚙️ Main Configuration

### `src/config.jsx` File

This is the main configuration file where you can customize:

```javascript
export const globalVariables = {
    COMPANY_NAME: 'Your Airline',              // Your airline name
    API_URL: 'http://your-backend:8000',       // Your backend URL
    PAGE_TITLE: 'Your Airline - System',      // Page title
    
    // Customizable translations
    CUSTOM_TRANSLATIONS: {
        welcome: {
            ES: "Bienvenido a",
            EN: "Welcome to",
            // ... other languages
        },
        title: {
            ES: "¡Your Airline!",
            EN: "Your Airline!",
            // ... other languages
        }
        // ... more translations
    }
};
```

### Graphic Resources

Place your resources in `public/resources/`:
- `HiCrew.png` - Main logo
- `background-banner.png` - Banner background
- `ad-banner.png` - Advertisement banner
- `view-*.png` - Screenshots of your system

## 🔧 Available Scripts

- `npm start` - Starts the development server
- `npm test` - Runs tests
- `npm run build` - Creates production build
- `npm run eject` - Exposes webpack configuration (⚠️ irreversible)

## 🌐 Complete System

This frontend works together with:

- **Backend**: [HiCrewBackend](https://github.com/alejandro-diazro/HiCrewBackend) - API and server logic
- **HiACARS**: Automatic tracking system for flight simulators

## 🤝 Contributing

Contributions are welcome! If you want to collaborate:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Review Process

- All contributions will be reviewed by maintainers
- Automated tests will be run
- Once approved, they will be integrated into the main project
- Keep code clean and well documented

### Contributing Guidelines

- Follow existing code conventions
- Include tests for new features
- Update documentation if necessary
- Respect the project's file structure

## 📄 License

This project is under the **MIT License**. This means:

- ✅ **Commercial use allowed**
- ✅ **Modification allowed**
- ✅ **Distribution allowed**
- ✅ **Private use allowed**

**Conditions:**
- You must include the copyright notice and license
- Software is provided "as is", without warranties

See the [LICENSE](LICENSE) file for more details.

## 🆘 Support

If you have problems or questions:

1. **Check the [backend documentation](https://github.com/alejandro-diazro/HiCrewBackend)**
2. **Search existing issues**
3. **Create a new issue** with specific details
4. **Join our developer community**

## 🏗️ Project Architecture

```
src/
├── components/          # Reusable components
├── pages/              # Main pages
├── api/                # API calls
├── config.jsx          # 🔧 MAIN CONFIGURATION
└── translations/       # Translation system

public/
└── resources/          # 🎨 GRAPHIC RESOURCES
```

## 🌟 Credits

Developed by [Alejandro Díaz](https://github.com/alejandro-diazro)

---

**Ready to create your virtual airline?** 🛫

1. Setup the backend
2. Customize `config.jsx`
3. Add your graphic resources
4. Take off! 🚀
