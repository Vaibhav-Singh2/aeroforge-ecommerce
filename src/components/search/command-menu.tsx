"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  X,
  Plane,
  ShoppingBag,
  Wrench,
  Printer,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  FileText,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { closeSearch, openSearch } from "@/lib/redux/features/uiSlice";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ProductResult {
  id: string;
  name: string;
  slug: string;
  url?: string;
  sku: string;
  price: number;
  image?: string;
  category: string;
  isBestseller?: boolean;
}

interface CategoryResult {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: string;
  imageUrl?: string;
}

interface ServiceResult {
  id: string;
  name: string;
  description: string;
  href: string;
  badge: string;
}

const DEFAULT_QUICK_LINKS = [
  {
    title: "All Ready-Made Drone Projects",
    href: "/category/projects",
    icon: Plane,
    badge: "Catalog",
  },
  {
    title: "Avionics, Motors & Carbon Parts",
    href: "/category/parts-and-accessories",
    icon: ShoppingBag,
    badge: "Hardware",
  },
  {
    title: "On-Demand 3D Printing Service",
    href: "/services/3d-printing",
    icon: Printer,
    badge: "Manufacturing",
  },
  {
    title: "Diagnostics & Hardware Repair Portal",
    href: "/services/repair",
    icon: Wrench,
    badge: "Diagnostics",
  },
];

export function CommandMenu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isSearchOpen } = useAppSelector((state) => state.ui);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductResult[]>([]);
  const [categories, setCategories] = useState<CategoryResult[]>([]);
  const [services, setServices] = useState<ServiceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isSearchOpen) {
          dispatch(closeSearch());
        } else {
          dispatch(openSearch());
        }
      }
      if (e.key === "Escape" && isSearchOpen) {
        dispatch(closeSearch());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, dispatch]);

  // Universal multi-domain search across Products, Categories, Services
  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setCategories([]);
      setServices([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
          setCategories(data.categories || []);
          setServices(data.services || []);
        }
      } catch (err) {
        console.error("Universal Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (href: string) => {
    dispatch(closeSearch());
    setQuery("");
    startTransition(() => {
      router.push(href);
    });
  };

  const totalResultsCount = products.length + categories.length + services.length;

  return (
    <Dialog open={isSearchOpen} onOpenChange={(open) => !open && dispatch(closeSearch())}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 shadow-2xl border bg-background/95 backdrop-blur-md">
        {/* Search Input Bar */}
        <div className="flex items-center border-b px-4 py-3.5">
          <Search className="mr-3 h-5 w-5 text-primary shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories, 3D printing & repair services... (Esc to exit)"
            className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-hidden"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground p-1 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <ScrollArea className="max-h-[420px] p-4">
          {/* Quick Actions if query is empty */}
          {!query.trim() && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2">
                  Featured & Quick Actions
                </span>
                <div className="mt-2 space-y-1">
                  {DEFAULT_QUICK_LINKS.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.href}
                        onClick={() => handleSelect(action.href)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 text-primary" />
                          <span>{action.title}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-normal">
                          {action.badge}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Type product name, SKU, or service query for instant universal lookup.
                </span>
                <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono border text-foreground font-semibold">
                  Esc
                </kbd>
              </div>
            </div>
          )}

          {/* Search Loading Indicator */}
          {loading && (
            <div className="flex items-center justify-center py-10 text-xs text-muted-foreground gap-2">
              <Clock className="h-4 w-4 animate-spin text-primary" />
              <span>Searching across products, categories & services...</span>
            </div>
          )}

          {/* Live Search Results */}
          {!loading && query.trim() && (
            <div className="space-y-4">
              {totalResultsCount === 0 ? (
                <div className="py-10 text-center text-xs text-muted-foreground">
                  No matching products, categories, or services found for <strong className="text-foreground">&quot;{query}&quot;</strong>.
                </div>
              ) : (
                <>
                  {/* 1. Services Section */}
                  {services.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 flex items-center gap-1.5">
                        <Wrench className="h-3.5 w-3.5 text-primary" />
                        Services & Portals ({services.length})
                      </span>
                      <div className="space-y-1">
                        {services.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => handleSelect(service.href)}
                            className="flex w-full items-center justify-between rounded-lg border bg-card/60 p-2.5 hover:border-primary/40 hover:bg-muted/50 transition-all text-left"
                          >
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-foreground">
                                {service.name}
                              </span>
                              <span className="text-[11px] text-muted-foreground line-clamp-1">
                                {service.description}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              <Badge variant="secondary" className="text-[10px] py-0">
                                {service.badge}
                              </Badge>
                              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Categories Section */}
                  {categories.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-primary" />
                        Categories ({categories.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleSelect(`/category/${cat.type}/${cat.slug}`)}
                            className="flex items-center justify-between rounded-lg border bg-card/60 p-2.5 hover:border-primary/40 hover:bg-muted/50 transition-all text-left"
                          >
                            <span className="text-xs font-semibold text-foreground truncate">
                              {cat.name}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-2" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Products Section */}
                  {products.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 flex items-center gap-1.5">
                        <ShoppingBag className="h-3.5 w-3.5 text-primary" />
                        Products & Hardware ({products.length})
                      </span>
                      <div className="space-y-1.5">
                        {products.map((product) => (
                          <button
                            key={product.id}
                            onClick={() =>
                              handleSelect(
                                product.url || `/product/${product.slug}`,
                              )
                            }
                            className="flex w-full items-center justify-between rounded-lg border bg-card/60 p-2.5 hover:border-primary/40 hover:bg-muted/50 transition-all text-left"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              {product.image && (
                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex flex-col truncate">
                                <span className="text-xs font-semibold text-foreground truncate">
                                  {product.name}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  {product.category} {product.sku ? `• ${product.sku}` : ""}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              {product.isBestseller && (
                                <Badge variant="secondary" className="text-[10px] py-0 hidden sm:inline-flex">
                                  Bestseller
                                </Badge>
                              )}
                              <span className="text-xs font-bold text-foreground">
                                ₹{product.price.toLocaleString("en-IN")}
                              </span>
                              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
