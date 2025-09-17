# RentEase

A comprehensive, professional rental management system built for landlords to manage properties, tenants, and payments efficiently.

## 🏠 Features

### Property Management

- ✅ Add, edit, and delete properties with detailed information
- ✅ Property types: Apartment, House, Commercial
- ✅ Track rent amounts, availability status, and property details
- ✅ Property image upload support (UI ready)
- ✅ Advanced property filtering and search

### Tenant Management

- ✅ Complete tenant profiles with contact information
- ✅ Lease management with start/end dates
- ✅ Emergency contact information
- ✅ Tenant history and lease status tracking
- ✅ Automatic property assignment and availability updates

### Payment Tracking

- ✅ Record rent payments with multiple payment methods
- ✅ Payment status tracking (Paid, Pending, Overdue, Partial)
- ✅ Outstanding balance and overdue payment identification
- ✅ Receipt generation with unique receipt numbers
- ✅ Payment history and search functionality

### Reminders & Notifications

- ✅ Automatic rent due date reminders
- ✅ Lease expiry notifications (60-day advance warning)
- ✅ Overdue payment alerts
- ✅ System-generated notifications with read/unread status
- ✅ Notification categorization and management

### Reports & Analytics

- ✅ Monthly and yearly income reports with charts
- ✅ Occupancy rate tracking and visualization
- ✅ Property type analysis
- ✅ Payment status overview
- ✅ Downloadable reports (JSON format)
- ✅ Interactive charts and graphs using Recharts

### User Authentication & Security

- ✅ Secure login system with demo credentials
- ✅ Role-based access (Landlord, Manager, Assistant)
- ✅ Profile management
- ✅ Security settings and preferences
- ✅ Two-factor authentication support (UI ready)

## 🚀 Technology Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Beautiful, accessible component library
- **Recharts** - Responsive charts and data visualization
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Sonner** - Toast notifications
- **Lucide React** - Beautiful icons
- **Date-fns** - Date manipulation and formatting

### Development Tools

- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd rental-management-system
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**

   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - Use the demo credentials to login:
     - **Email**: landlord@example.com
     - **Password**: password

## 🔐 Demo Credentials

The system comes with pre-configured demo data for testing:

- **Email**: `landlord@example.com`
- **Password**: `password`

## 📱 Usage Guide

### Getting Started

1. **Login** using the demo credentials
2. **Dashboard** - View overview of properties, tenants, and payments
3. **Add Properties** - Start by adding your rental properties
4. **Add Tenants** - Assign tenants to available properties
5. **Record Payments** - Track rent payments and generate receipts
6. **View Reports** - Analyze your rental business performance

### Key Workflows

#### Adding a New Property

1. Navigate to Properties page
2. Click "Add Property"
3. Fill in property details (address, type, rent amount, etc.)
4. Save the property

#### Adding a New Tenant

1. Navigate to Tenants page
2. Click "Add Tenant"
3. Fill in tenant information and lease details
4. Select an available property
5. Property automatically becomes "Occupied"

#### Recording a Payment

1. Navigate to Payments page
2. Click "Record Payment"
3. Select tenant and enter payment details
4. System generates unique receipt number

## 🏗️ Architecture

### Data Storage

- **Local Storage**: All data is stored in browser's localStorage
- **Mock Data**: Includes sample properties, tenants, and payments
- **Type Safety**: Full TypeScript interfaces for all data models

### Component Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard widgets
│   ├── layout/         # Layout components (Header, Sidebar)
│   └── ui/             # Shadcn/UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and storage management
├── pages/              # Main application pages
└── types/              # TypeScript type definitions
```

### Key Components

- **Authentication**: Secure login with role-based access
- **Layout**: Responsive sidebar navigation and header
- **Data Management**: Local storage with TypeScript models
- **Charts**: Interactive visualizations with Recharts
- **Notifications**: System-generated alerts and reminders

## 🚀 Deployment

### Build for Production

```bash
pnpm run build
# or
npm run build
```

### Deploy Options

1. **Static Hosting** (Netlify, Vercel, GitHub Pages)
2. **Traditional Web Server** (Apache, Nginx)
3. **CDN Deployment** (AWS CloudFront, Cloudflare)

## 🔧 Configuration

### Environment Variables

Create a `.env` file for production configurations:

```env
VITE_APP_TITLE=Rental Management System
VITE_API_URL=your-api-endpoint
VITE_ENABLE_ANALYTICS=true
```

### Customization

#### Branding

- Update `index.html` title and meta tags
- Modify colors in `tailwind.config.ts`
- Replace favicon in `public/` directory

#### Features

- Enable/disable features in component files
- Modify notification types in `types/index.ts`
- Customize dashboard widgets in `components/dashboard/`

## 🔮 Future Enhancements

The system is designed to be easily extensible. Planned enhancements include:

### Backend Integration

- RESTful API with Node.js/Express or Django
- PostgreSQL/MySQL database integration
- User authentication with JWT tokens
- File upload for property images

### Advanced Features

- **Email/SMS Integration**: Real notification delivery
- **Maintenance Requests**: Tenant maintenance reporting
- **Document Management**: Lease agreements and documents
- **Mobile App**: React Native companion app
- **Multi-tenancy**: Support for multiple landlords
- **Payment Gateway**: Online rent collection
- **Advanced Analytics**: Predictive analytics and insights

### Technical Improvements

- **Real-time Updates**: WebSocket integration
- **Offline Support**: Progressive Web App (PWA)
- **Performance**: Code splitting and lazy loading
- **Testing**: Unit and integration tests
- **CI/CD**: Automated deployment pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the documentation above
2. Search existing issues
3. Create a new issue with detailed information
4. Contact the development team

## 🙏 Acknowledgments

- **Shadcn/UI** - For the beautiful component library
- **Tailwind CSS** - For the utility-first CSS framework
- **Recharts** - For the charting capabilities
- **Lucide** - For beautiful icons
- **React Community** - For the amazing ecosystem

---

**Built with ❤️ for landlords and property managers**
