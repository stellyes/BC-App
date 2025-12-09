# Daily Deals Framework - Data Organization Guide

## Overview
This guide explains how to add, manage, and organize daily deals in your app. The deals framework allows you to create clickable banners that navigate to dedicated deal detail pages showing qualifying products.

## File Structure

```
BCapp/
├── app/
│   ├── deal-detail.tsx          # Dynamic deal detail page
│   └── (tabs)/
│       └── index.tsx             # Home page with banner carousel
├── data/
│   └── deals-data.json           # Sample deal data structure
├── assets/
│   └── mobilebanners/            # Banner images directory
│       ├── jettymobilebanner.png
│       ├── britemobilebanner.png
│       ├── KINDmobilebanner.png
│       ├── FFFmobilebanner.png
│       └── ICEDmobilebanner.png
└── docs/
    └── DEALS_GUIDE.md            # This file
```

## Data Structure

### Deal Object Schema

Each deal in the system should have the following structure:

```typescript
{
  id: "unique-deal-id",
  title: "Deal Title (e.g., BOGO 50% OFF)",
  description: "Detailed description of the deal",
  bannerImage: require('../assets/mobilebanners/filename.png'),
  filters: {
    brand?: "Brand Name",           // Filter by single brand
    brands?: ["Brand1", "Brand2"],  // Filter by multiple brands (OR)
    category?: "CATEGORY_TYPE",     // Filter by single category
    categories?: ["CAT1", "CAT2"]   // Filter by multiple categories (OR)
  }
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the deal. Must match the ID used in the banner carousel. |
| `title` | string | Yes | Short, catchy title displayed on the deal detail page (e.g., "BOGO 50% OFF"). |
| `description` | string | Yes | Full description explaining the deal terms (e.g., "Buy one, get one 50% off on all qualifying products!"). |
| `bannerImage` | any | Yes | Imported banner image using `require()`. |
| `filters` | object | Yes | Filter criteria to determine which products qualify for this deal. |
| `filters.brand` | string | No | Filter products by a single brand name (exact match with `product_brand`). |
| `filters.brands` | string[] | No | Filter products by multiple brand names (OR logic - product matches any brand in the array). |
| `filters.category` | string | No | Filter products by a single category (exact match with `product_type`). |
| `filters.categories` | string[] | No | Filter products by multiple categories (OR logic - product matches any category in the array). |

### Filter Logic

**AND Logic Between Filter Types:**
- If you specify both `brand` AND `category`, products must match BOTH criteria
- Example: `{ brand: "KIND", category: "EDIBLE" }` = KIND brand AND edible products

**OR Logic Within Filter Arrays:**
- If you use `brands` array, products match ANY brand in the list
- If you use `categories` array, products match ANY category in the list
- Example: `{ brands: ["Jetty", "Brite Labs"] }` = Jetty OR Brite Labs products

**Available Categories:**
- `FLOWER` - Flower products
- `PREROLL` - Pre-rolled products
- `EDIBLE` - Edible products
- `EXTRACT` - Extract products
- `BEVERAGE` - Beverage products
- `TINCTURE` - Tincture products
- `TOPICAL` - Topical products
- `PILL` - Pill products
- `CARTRIDGE` - Cartridge products
- `MERCH` - Merchandise

## How to Add a New Deal

### Step 1: Prepare Your Banner Image

1. Create or obtain a banner image for your deal
2. **Recommended dimensions**: 800x300 pixels (aspect ratio ~8:3)
3. **Format**: PNG or JPG
4. **File naming**: Use descriptive, lowercase names (e.g., `summer-sale-banner.png`)
5. Save the image to: `assets/mobilebanners/`

### Step 2: Add Deal Data

Deal data is stored directly in [app/deal-detail.tsx](../app/deal-detail.tsx) in the `DEALS_DATA` constant (lines 31-79).

**Examples:**

```typescript
const DEALS_DATA = {
  // Filter by brand only
  '6': {
    id: '6',
    title: 'Jetty Extracts BOGO',
    description: 'Buy one Jetty product, get one 50% off!',
    bannerImage: require('../assets/mobilebanners/summer-sale-banner.png'),
    filters: {
      brand: 'Jetty',
    },
  },

  // Filter by category only
  '7': {
    id: '7',
    title: 'Edibles Flash Sale',
    description: '20% off all edibles today!',
    bannerImage: require('../assets/mobilebanners/edibles-sale.png'),
    filters: {
      category: 'EDIBLE',
    },
  },

  // Filter by brand AND category
  '8': {
    id: '8',
    title: 'KIND Edibles Special',
    description: 'Special pricing on KIND edibles only!',
    bannerImage: require('../assets/mobilebanners/kind-deal.png'),
    filters: {
      brand: 'KIND',
      category: 'EDIBLE',
    },
  },

  // Filter by multiple brands
  '9': {
    id: '9',
    title: 'Premium Extract Sale',
    description: 'Save on select premium extract brands!',
    bannerImage: require('../assets/mobilebanners/extract-sale.png'),
    filters: {
      brands: ['Jetty', 'Brite Labs', 'Raw Garden'],
      category: 'EXTRACT',
    },
  },

  // Filter by multiple categories
  '10': {
    id: '10',
    title: 'Smokables Deal',
    description: 'All flower and prerolls on sale!',
    bannerImage: require('../assets/mobilebanners/smokables.png'),
    filters: {
      categories: ['FLOWER', 'PREROLL'],
    },
  },
};
```

### Step 3: Add Banner to Carousel

In [app/(tabs)/index.tsx](../app/(tabs)/index.tsx), add your new banner to the `banners` array (around line 61):

```typescript
const banners = [
  { id: '1', source: require('../../assets/mobilebanners/jettymobilebanner.png') },
  { id: '2', source: require('../../assets/mobilebanners/britemobilebanner.png') },
  { id: '3', source: require('../../assets/mobilebanners/KINDmobilebanner.png') },
  { id: '4', source: require('../../assets/mobilebanners/FFFmobilebanner.png') },
  { id: '5', source: require('../../assets/mobilebanners/ICEDmobilebanner.png') },
  { id: '6', source: require('../../assets/mobilebanners/summer-sale-banner.png') }, // NEW
];
```

**Important:** The `id` field must match the key in `DEALS_DATA`.

### Step 4: Understanding Product Filtering

**No manual product entry needed!** The system automatically filters products from your product database based on the `filters` you define.

**How it works:**
1. The deal detail page reads all products from `data/dummy-products.json`
2. It applies your filter criteria to find matching products
3. Only matching products are displayed on the deal page

**Filter matching is based on:**
- `product_brand` field in your product data (must match exactly)
- `product_type` field in your product data (must match exactly)

**To find valid brand names and categories:**
1. Look at your `data/dummy-products.json` file
2. Check the `product_brand` field for brand names
3. Check the `product_type` field for category types

**Example product from dummy-products.json:**
```json
{
  "product_id": "1",
  "product_name": "Orange Creamsicle",
  "product_brand": "Cantrip",
  "product_type": "BEVERAGE",
  "price": 8.99,
  ...
}
```

To create a deal for all Cantrip beverages:
```typescript
filters: {
  brand: 'Cantrip',
  category: 'BEVERAGE',
}
```

## Connecting to Your Product Database

### Current Implementation (Dynamic Filtering)

The current implementation uses **dynamic filtering** to automatically find qualifying products:

1. All products are loaded from `data/dummy-products.json`
2. Products are filtered in real-time using the `filters` object
3. No manual product entry required!

**The filtering logic ([deal-detail.tsx:98-129](../app/deal-detail.tsx#L98-L129)):**
```typescript
const qualifyingProducts = useMemo(() => {
  if (!deal) return [];

  const allProducts = dummyProductsData.data.stock;
  const filters = deal.filters;

  return allProducts.filter((product) => {
    let matches = true;

    // Filter by single brand
    if (filters.brand) {
      matches = matches && product.product_brand === filters.brand;
    }

    // Filter by multiple brands (OR logic)
    if (filters.brands && filters.brands.length > 0) {
      matches = matches && filters.brands.includes(product.product_brand);
    }

    // Filter by single category
    if (filters.category) {
      matches = matches && product.product_type === filters.category;
    }

    // Filter by multiple categories (OR logic)
    if (filters.categories && filters.categories.length > 0) {
      matches = matches && filters.categories.includes(product.product_type);
    }

    return matches;
  });
}, [deal]);
```

### Production Implementation

For a production app with an API:

1. **Replace the import** with an API call:
```typescript
// Instead of: import dummyProductsData from '../data/dummy-products.json';
const [allProducts, setAllProducts] = useState([]);

useEffect(() => {
  fetchProducts().then(setAllProducts);
}, []);
```

2. **Keep the same filter logic** - it will work with any product data source
3. **Store deals in a database** and fetch them via API
4. **The `filters` object stays the same** - just ensure your API products have `product_brand` and `product_type` fields

## Deal Display Logic

### How Banners Navigate to Deal Pages

When a user taps a banner in the carousel ([index.tsx:237-244](../app/(tabs)/index.tsx#L237-L244)):

```typescript
<TouchableOpacity
  onPress={() => {
    if (banner.id) {
      router.push({
        pathname: '/deal-detail',
        params: { dealId: banner.id },
      });
    }
  }}
>
  <Image source={banner.source} style={styles.bannerImage} />
</TouchableOpacity>
```

The `dealId` is passed as a URL parameter to the deal detail page, which then looks up the corresponding deal data.

### Deal Detail Page Layout

The deal detail page ([deal-detail.tsx](../app/deal-detail.tsx)) has two main sections:

1. **Fixed Header** (lines 93-111)
   - Back button
   - Banner image
   - Deal title and description
   - Stays fixed at the top while user scrolls

2. **Scrollable Products List** (lines 113-135)
   - "Qualifying Products" header
   - FlatList of products
   - Each product card shows: image, category, name, price, and add button
   - Empty state if no products available

## Tips for Managing Deals

### Best Practices

1. **Use descriptive IDs**: `summer-bogo-2025` instead of `1`, `2`, `3`
2. **Keep banner images consistent**: Same dimensions and style across all banners
3. **Test deals before activating**: Verify all product links work correctly
4. **Set expiration dates**: Use `startDate` and `endDate` to auto-activate/deactivate deals
5. **Update regularly**: Keep the carousel fresh with new deals

### Deal Types Examples

**BOGO (Buy One Get One)**
- Title: "BOGO 50% OFF"
- Description: "Buy one, get one 50% off on all qualifying products!"

**Quantity Discount**
- Title: "Buy 2, Get 1 for $1"
- Description: "Purchase any 2 products and get a third for just $1!"

**Percentage Off**
- Title: "Flash Sale - 20% Off"
- Description: "20% off all edibles - today only!"

**Category Discount**
- Title: "Flower Friday"
- Description: "All flower products 15% off every Friday!"

## Future Enhancements

Consider adding these features in future iterations:

- [ ] Deal scheduling system (auto-activate/deactivate based on dates)
- [ ] Deal analytics (track clicks, conversions)
- [ ] Deal categories/tags (filter by type)
- [ ] User-specific deals (personalized offers)
- [ ] Push notifications for new deals
- [ ] Admin panel for managing deals
- [ ] A/B testing for deal banners
- [ ] Deal stacking rules (can multiple deals be combined?)

## Troubleshooting

### "Deal not found" error
- **Cause**: The `dealId` in the banner doesn't match any key in `DEALS_DATA`
- **Solution**: Verify the `id` in the banner array matches the deal object key

### Banner images not displaying
- **Cause**: Incorrect file path or missing image file
- **Solution**: Check that the image exists in `assets/mobilebanners/` and the path is correct

### Products not showing
- **Cause**: Empty `qualifyingProducts` array
- **Solution**: Add product objects to the deal's `qualifyingProducts` array

### Carousel not scrolling to deal page
- **Cause**: Navigation not set up correctly or missing router
- **Solution**: Verify `useRouter()` is imported and the `onPress` handler is correct

## Questions?

For implementation questions or issues, please refer to:
- [deal-detail.tsx](../app/deal-detail.tsx) - Deal detail page implementation
- [index.tsx](../app/(tabs)/index.tsx) - Banner carousel implementation
- [deals-data.json](../data/deals-data.json) - Sample data structure
