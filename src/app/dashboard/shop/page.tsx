"use client";

import React, { useState } from "react";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "coins" | "gems";
  icon: string;
  category: "themes" | "powerups" | "certificates" | "avatars";
  rarity: "common" | "rare" | "epic" | "legendary";
  discount?: number;
  isPopular?: boolean;
  isLimited?: boolean;
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<
    "all" | "themes" | "powerups" | "certificates" | "avatars"
  >("all");
  const [userCoins] = useState(2450);
  const [userGems] = useState(15);

  const shopItems: ShopItem[] = [
    {
      id: "1",
      name: "Neon Glow Theme",
      description:
        "Transform your dashboard with vibrant neon colors and glowing effects",
      price: 500,
      currency: "coins",
      icon: "🎨",
      category: "themes",
      rarity: "rare",
      isPopular: true,
    },
    {
      id: "2",
      name: "2x XP Boost",
      description: "Double your XP gains for 24 hours",
      price: 3,
      currency: "gems",
      icon: "⚡",
      category: "powerups",
      rarity: "common",
    },
    {
      id: "3",
      name: "JavaScript Master Certificate",
      description: "Official certificate showcasing your JavaScript expertise",
      price: 1200,
      currency: "coins",
      icon: "📜",
      category: "certificates",
      rarity: "epic",
    },
    {
      id: "4",
      name: "Cosmic Avatar Pack",
      description: "Unlock 10 unique space-themed avatars",
      price: 8,
      currency: "gems",
      icon: "🚀",
      category: "avatars",
      rarity: "legendary",
      isLimited: true,
    },
    {
      id: "5",
      name: "Dark Mode Pro",
      description: "Enhanced dark theme with customizable accents",
      price: 300,
      currency: "coins",
      icon: "🌙",
      category: "themes",
      rarity: "common",
      discount: 20,
    },
    {
      id: "6",
      name: "Streak Protector",
      description: "Protects your learning streak for one missed day",
      price: 2,
      currency: "gems",
      icon: "🛡️",
      category: "powerups",
      rarity: "rare",
    },
  ];

  const categories = [
    { id: "all", name: "All Items", icon: "🛍️" },
    { id: "themes", name: "Themes", icon: "🎨" },
    { id: "powerups", name: "Power-ups", icon: "⚡" },
    { id: "certificates", name: "Certificates", icon: "📜" },
    { id: "avatars", name: "Avatars", icon: "👤" },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-600";
      case "rare":
        return "from-blue-400 to-blue-600";
      case "epic":
        return "from-purple-400 to-purple-600";
      case "legendary":
        return "from-yellow-400 to-orange-500";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const filteredItems =
    activeCategory === "all"
      ? shopItems
      : shopItems.filter((item) => item.category === activeCategory);

  const canAfford = (item: ShopItem) => {
    return item.currency === "coins"
      ? userCoins >= item.price
      : userGems >= item.price;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6 animate-bounce">
            <span className="text-3xl">🛍️</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
            Power-Up Store
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Enhance your learning journey with premium items and power-ups
          </p>

          {/* Currency Display */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 min-w-[120px]">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-2xl">🪙</span>
                <span className="text-lg font-bold text-yellow-400">
                  {userCoins.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-400">Coins</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 min-w-[120px]">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-2xl">💎</span>
                <span className="text-lg font-bold text-purple-400">
                  {userGems}
                </span>
              </div>
              <div className="text-xs text-gray-400">Gems</div>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-2">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    setActiveCategory(
                      category.id as
                        | "all"
                        | "themes"
                        | "powerups"
                        | "certificates"
                        | "avatars"
                    )
                  }
                  className={`px-6 py-3 rounded-lg text-center transition-all duration-300 ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span className="font-bold">{category.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Items Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  🎉 Limited Time Offers!
                </h2>
                <p className="text-white/80 mb-4">
                  Grab these exclusive items before they&apos;re gone
                </p>
                <div className="flex space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-white font-bold">
                      Cosmic Avatar Pack
                    </div>
                    <div className="text-white/80 text-sm">
                      50% OFF • 2 days left
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-6xl animate-pulse">🚀</div>
            </div>
          </div>
        </div>

        {/* Shop Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="relative group">
              {/* Special Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                {item.isPopular && (
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    🔥 POPULAR
                  </span>
                )}
                {item.isLimited && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    ⏰ LIMITED
                  </span>
                )}
                {item.discount && (
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{item.discount}% OFF
                  </span>
                )}
              </div>

              {/* Item Card */}
              <div
                className={`bg-gradient-to-br ${getRarityColor(
                  item.rarity
                )} p-0.5 rounded-2xl group-hover:scale-105 transition-transform duration-300`}
              >
                <div className="bg-dark-100/95 backdrop-blur-sm rounded-2xl p-6 h-full border border-white/5">
                  {/* Item Header */}
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Rarity Badge */}
                  <div className="text-center mb-6">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(
                        item.rarity
                      )} text-white shadow-lg`}
                    >
                      {item.rarity.toUpperCase()}
                    </span>
                  </div>

                  {/* Price & Purchase */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 font-medium">Price:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">
                          {item.currency === "coins" ? "🪙" : "💎"}
                        </span>
                        <span
                          className={`text-lg font-bold ${
                            item.discount
                              ? "line-through text-gray-500"
                              : item.currency === "coins"
                              ? "text-yellow-400"
                              : "text-purple-400"
                          }`}
                        >
                          {item.price}
                        </span>
                        {item.discount && (
                          <span
                            className={`text-lg font-bold ${
                              item.currency === "coins"
                                ? "text-yellow-400"
                                : "text-purple-400"
                            }`}
                          >
                            {Math.floor(item.price * (1 - item.discount / 100))}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      disabled={!canAfford(item)}
                      className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                        canAfford(item)
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 hover:shadow-lg"
                          : "bg-gray-600 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {canAfford(item) ? "Purchase" : "Insufficient Funds"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How to Earn Currency */}
        <div className="mt-12 bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            How to Earn Currency
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl">🪙</span>
                <div>
                  <h4 className="text-lg font-bold text-yellow-400">
                    Earn Coins
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Common currency for regular purchases
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">•</span>
                  <span>Complete coding challenges (+50-200 coins)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">•</span>
                  <span>Finish mini projects (+300-800 coins)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">•</span>
                  <span>Daily login bonus (+25 coins)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">•</span>
                  <span>Maintain learning streaks (+10 coins/day)</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl">💎</span>
                <div>
                  <h4 className="text-lg font-bold text-purple-400">
                    Earn Gems
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Premium currency for exclusive items
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="text-purple-400">•</span>
                  <span>Unlock achievements (+1-5 gems)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-400">•</span>
                  <span>Top leaderboard positions (+2-10 gems)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-400">•</span>
                  <span>Complete weekly challenges (+3 gems)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-400">•</span>
                  <span>Perfect quiz scores (+1 gem)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
