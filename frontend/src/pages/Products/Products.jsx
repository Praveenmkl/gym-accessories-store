import React, { useEffect, useState, useCallback } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import api from '../../api/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, SlidersHorizontal, RotateCcw, X, PackageOpen, ArrowUpDown } from "lucide-react";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter & sort states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  // Applied filter state snapshot (for active tags & display)
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    category: 'All',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'default'
  });

  const fetchProducts = useCallback(async (overrideFilters) => {
    setLoading(true);
    setError('');

    try {
      const s = overrideFilters?.search !== undefined ? overrideFilters.search : search;
      const c = overrideFilters?.category !== undefined ? overrideFilters.category : category;
      const min = overrideFilters?.minPrice !== undefined ? overrideFilters.minPrice : minPrice;
      const max = overrideFilters?.maxPrice !== undefined ? overrideFilters.maxPrice : maxPrice;
      const stock = overrideFilters?.inStock !== undefined ? overrideFilters.inStock : inStock;
      const sort = overrideFilters?.sortBy !== undefined ? overrideFilters.sortBy : sortBy;

      const params = new URLSearchParams();
      if (s && s.trim()) params.append('search', s.trim());
      if (c && c !== 'All') params.append('category', c);
      if (min !== '' && !isNaN(Number(min))) params.append('minPrice', min);
      if (max !== '' && !isNaN(Number(max))) params.append('maxPrice', max);
      if (stock) params.append('inStock', 'true');
      if (sort && sort !== 'default') params.append('sort', sort);

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products || []);
      
      if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(data.categories.filter(Boolean));
      }

      setAppliedFilters({
        search: s,
        category: c,
        minPrice: min,
        maxPrice: max,
        inStock: stock,
        sortBy: sort
      });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, minPrice, maxPrice, inStock, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    fetchProducts();
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    fetchProducts({ category: newCategory });
  };

  const handleStockToggle = () => {
    const nextStock = !inStock;
    setInStock(nextStock);
    fetchProducts({ inStock: nextStock });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    fetchProducts({ sortBy: newSort });
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setSortBy('default');
    
    fetchProducts({
      search: '',
      category: 'All',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'default'
    });
  };

  const removeSingleFilter = (key) => {
    const updated = {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy,
      [key]: key === 'category' ? 'All' : key === 'inStock' ? false : key === 'sortBy' ? 'default' : ''
    };

    if (key === 'search') setSearch('');
    if (key === 'category') setCategory('All');
    if (key === 'minPrice') setMinPrice('');
    if (key === 'maxPrice') setMaxPrice('');
    if (key === 'inStock') setInStock(false);
    if (key === 'sortBy') setSortBy('default');

    fetchProducts(updated);
  };

  const hasActiveFilters = 
    Boolean(appliedFilters.search) || 
    (appliedFilters.category && appliedFilters.category !== 'All') || 
    appliedFilters.minPrice !== '' || 
    appliedFilters.maxPrice !== '' || 
    appliedFilters.inStock ||
    appliedFilters.sortBy !== 'default';

  // Default preset fallback categories merged with dynamic categories from database
  const allCategoryList = Array.from(
    new Set(['General', 'Equipment', 'Supplements', 'Apparel', ...categories])
  );

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
      {/* Header Banner */}
      <div className="flex flex-col items-center mb-10 text-center">
        <Badge variant="secondary" className="mb-3 px-3 py-1 font-semibold tracking-wide text-xs uppercase bg-slate-100 text-slate-700">
          Exclusive Collection
        </Badge>
        <h1 className='text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 uppercase'>
          Our Products
        </h1>
        <p className='text-neutral-500 max-w-xl text-sm sm:text-base mt-2'>
          Discover premium fitness gear, apparel, and supplements built for elite performance.
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-8 items-start'>
        {/* Sidebar Filters */}
        <Card className='w-full lg:w-80 shrink-0 border border-neutral-200 bg-white shadow-none rounded-none sticky top-24'>
          <CardHeader className="p-5 pb-4 border-b border-neutral-100 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-black">
              <SlidersHorizontal className="w-4 h-4 text-black" />
              <span>Filters</span>
            </CardTitle>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-black flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </CardHeader>
          
          <CardContent className="p-5">
            <form onSubmit={handleApplyFilters} className="space-y-5">
              {/* Search Field */}
              <div className='space-y-2'>
                <Label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Search
                </Label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                  <Input 
                    className="pl-10 pr-8 h-10 text-sm bg-neutral-50 border-neutral-200 rounded-none focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black transition-all placeholder:text-neutral-400"
                    placeholder="Search products..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setSearch('');
                        fetchProducts({ search: '' });
                      }}
                      className="absolute right-3 top-3 text-neutral-400 hover:text-black"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Field */}
              <div className='space-y-2'>
                <Label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Category
                </Label>
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-10 text-sm bg-neutral-50 border-neutral-200 rounded-none focus:ring-1 focus:ring-black">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-neutral-200 shadow-md">
                    <SelectItem value="All">All Categories</SelectItem>
                    {allCategoryList.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className='space-y-2'>
                <Label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Price Range (LKR)
                </Label>
                <div className='grid grid-cols-2 gap-2.5 items-center'>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-medium text-neutral-400">Min</span>
                    <Input 
                      className="h-10 text-sm pl-11 bg-neutral-50 border-neutral-200 rounded-none focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-black transition-all"
                      type="number" 
                      placeholder="0" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-medium text-neutral-400">Max</span>
                    <Input 
                      className="h-10 text-sm pl-11 bg-neutral-50 border-neutral-200 rounded-none focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-black transition-all"
                      type="number" 
                      placeholder="Any" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* In Stock Checkbox */}
              <div 
                className='flex items-center justify-between p-3 rounded-none bg-neutral-50 border border-neutral-200 hover:bg-neutral-100/70 transition-colors cursor-pointer select-none'
                onClick={handleStockToggle}
              >
                <div className="space-y-0.5">
                  <Label htmlFor="inStock" className="text-sm font-semibold text-neutral-900 cursor-pointer">
                    In Stock Only
                  </Label>
                  <p className="text-[11px] text-neutral-500">Hide out of stock items</p>
                </div>
                <Checkbox 
                  id="inStock"
                  checked={inStock}
                  onCheckedChange={handleStockToggle}
                  className="rounded-none w-5 h-5 data-[state=checked]:bg-black data-[state=checked]:border-black"
                />
              </div>

              {/* Actions */}
              <div className='flex flex-col gap-2.5 pt-3 border-t border-neutral-100'>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-none border border-black shadow-none transition-all active:scale-[0.98]"
                >
                  Apply Filters
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-10 border border-neutral-300 text-neutral-800 hover:text-black hover:bg-neutral-100 font-semibold text-xs uppercase tracking-wider rounded-none transition-all" 
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Product Grid Area */}
        <div className='flex-1 w-full space-y-6'>
          {/* Top Bar: Count, Sort & Active Filter Tags */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-50 p-4 border border-neutral-200">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-neutral-700">
                Showing <span className="font-bold text-black">{products.length}</span> {products.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort:
              </span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="h-9 w-40 text-xs font-medium bg-white border-neutral-200 rounded-none">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-neutral-200">
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-1">Active:</span>
              {appliedFilters.search && (
                <Badge variant="outline" className="gap-1.5 bg-white text-xs py-1 px-2.5 border-neutral-300 text-neutral-900 rounded-none">
                  Search: "{appliedFilters.search}"
                  <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => removeSingleFilter('search')} />
                </Badge>
              )}
              {appliedFilters.category && appliedFilters.category !== 'All' && (
                <Badge variant="outline" className="gap-1.5 bg-white text-xs py-1 px-2.5 border-neutral-300 text-neutral-900 rounded-none">
                  Category: {appliedFilters.category}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => removeSingleFilter('category')} />
                </Badge>
              )}
              {(appliedFilters.minPrice !== '' || appliedFilters.maxPrice !== '') && (
                <Badge variant="outline" className="gap-1.5 bg-white text-xs py-1 px-2.5 border-neutral-300 text-neutral-900 rounded-none">
                  Price: {appliedFilters.minPrice || '0'} - {appliedFilters.maxPrice || 'Any'} LKR
                  <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => { removeSingleFilter('minPrice'); removeSingleFilter('maxPrice'); }} />
                </Badge>
              )}
              {appliedFilters.inStock && (
                <Badge variant="outline" className="gap-1.5 bg-white text-xs py-1 px-2.5 border-neutral-300 text-neutral-900 rounded-none">
                  In Stock Only
                  <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => removeSingleFilter('inStock')} />
                </Badge>
              )}
              {appliedFilters.sortBy !== 'default' && (
                <Badge variant="outline" className="gap-1.5 bg-white text-xs py-1 px-2.5 border-neutral-300 text-neutral-900 rounded-none">
                  Sort: {appliedFilters.sortBy}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => removeSingleFilter('sortBy')} />
                </Badge>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-neutral-500 hover:text-red-600 font-semibold uppercase tracking-wider underline ml-2 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 bg-white border border-neutral-200">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-black" />
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-none text-center text-sm font-medium border border-red-200">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-20 bg-white border border-dashed border-neutral-300 p-8">
              <div className="w-16 h-16 bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold uppercase tracking-wider text-neutral-900">No products match your criteria</h3>
              <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
                Try adjusting your search terms, removing price bounds, or clearing filters.
              </p>
              <Button 
                onClick={handleResetFilters} 
                variant="outline" 
                className="mt-5 rounded-none border-black text-xs font-bold uppercase tracking-wider text-black hover:bg-neutral-100"
              >
                Clear All Filters
              </Button>
            </div>
          )}
          
          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;