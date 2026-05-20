# Tourist eSIM Node.js SDK

Official Node.js SDK for Tourist eSIM Partner API. Enable easy integration for resellers and partners to manage eSIM plans, orders, and customer data.

## Features

- 🔐 **OAuth 2.0 Authentication** - Secure Client Credentials flow with automatic token refresh
- 🚀 **Auto-Retry Logic** - Exponential backoff with 3 retry attempts on connection failures
- 📦 **Type-Safe** - Full TypeScript support with complete type definitions
- 💾 **Token Caching** - In-memory token cache to reduce OAuth requests
- ⚡ **Async/Await** - Modern async/await support throughout the SDK
- 🔄 **Pagination Support** - Built-in pagination for catalog queries
- 🎯 **Exception Hierarchy** - Specific exceptions for different error scenarios

## Requirements

- Node.js 20 LTS or higher
- npm or yarn

## Installation

```bash
npm install @tourist-esim/touristesim-nodejs-sdk
```

or

```bash
yarn add @tourist-esim/touristesim-nodejs-sdk
```

## Quick Start

```typescript
import { TouristEsim } from '@tourist-esim/touristesim-nodejs-sdk';

const sdk = new TouristEsim(
  'your-client-id',
  'your-client-secret'
);

// Fetch all plans
const plans = await sdk.plans().get();
for (const plan of plans) {
  console.log(`${plan.get('name')} - ${plan.get('price')} ${plan.get('currency')}`);
}
```

## API Usage

### Plans

```typescript
// Get all plans with filters
const plans = await sdk.plans().get({
  country: 'US',
  type: 'global',
  per_page: 50,
  sort_by: 'price'
});

// Get single plan
const plan = await sdk.plans().find('vietnam_100mb_7days_7e87c5');

// Get plans by country
const usPlans = await sdk.plans().byCountry('US');

// Get global plans
const globalPlans = await sdk.plans().global();

// Validate plan
const validation = await sdk.plans().validate('vietnam_100mb_7days_7e87c5', 5);
```

### Countries

```typescript
// Get all countries
const countries = await sdk.countries().all();

// Find by code
const usa = await sdk.countries().find('US');

// Search countries
const asian = await sdk.countries().search('china');

// Featured countries
const featured = await sdk.countries().featured();
```

### Orders

```typescript
// Create order
const order = await sdk.orders().create({
  plans: [{ plan_slug: 'vietnam_100mb_7days_7e87c5', quantity: 1 }],
  customer: { email: 'customer@example.com', name: 'Jane Doe' },
});

// Get orders
const orders = await sdk.orders().all();

// Get single order by order number
const order = await sdk.orders().find('PO-260519MKAUVE');

// To request a cancellation or refund, contact Tourist eSIM support
```

### eSIMs

```typescript
// Get eSIMs
const esims = await sdk.esims().all();

// Find eSIM
const esim = await sdk.esims().find('8955001000000000000');

// Check usage
const usage = await sdk.esims().usage('8955001000000000000');

// Get topup packages
const packages = await sdk.esims().topupPackages('8955001000000000000');

// Purchase topup
await sdk.esims().topup('8955001000000000000', 789);

// Send setup email
await sdk.esims().sendEmail('8955001000000000000', 'user@example.com');
```

## Error Handling

```typescript
import {
  AuthenticationException,
  ValidationException,
  RateLimitException,
  ResourceNotFoundException
} from '@tourist-esim/touristesim-nodejs-sdk';

try {
  const plan = await sdk.plans().find('nonexistent_plan_slug');
} catch (error) {
  if (error instanceof AuthenticationException) {
    console.error('Auth failed:', error.message);
  } else if (error instanceof ValidationException) {
    console.error('Validation errors:', error.getErrors());
  } else if (error instanceof RateLimitException) {
    console.error('Rate limited. Retry after:', error.getRetryAfter(), 'seconds');
  } else if (error instanceof ResourceNotFoundException) {
    console.error('Not found:', error.message);
  } else {
    console.error('Error:', error);
  }
}
```

## API Documentation

For complete API documentation, visit:
- **API Docs**: https://docs.touristesim.net/
- **SDK Guides**: https://docs.touristesim.net/sdks/guides
- **Partner Dashboard**: https://partners.touristesim.net

## Support

For issues or questions:
- **Technical Support**: tech@touristesim.net
- **GitHub Issues**: https://github.com/touristesim/touristesim-nodejs-sdk/issues
- **Dashboard**: https://partners.touristesim.net

## License

MIT - see LICENSE file
