// 楽天レシピAPI仕様に基づくモックデータ
// UI開発用のモックデータ（Firebase接続前に使用）

// ========================
// レシピデータ
// ========================
export const mockRecipes = [
  {
    recipeId: 1180006594,
    categoryId: "30-166",
    recipeTitle: "簡単ふわふわオムライス",
    recipeUrl: "https://recipe.rakuten.co.jp/recipe/1180006594/",
    foodImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example1.jpg",
    mediumImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example1.jpg?thum=54",
    smallImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example1.jpg?thum=55",
    recipeDescription:
      "卵がふわふわで美味しいオムライスです。初心者でも簡単に作れます。",
    recipePublishday: "2024/11/01 10:30:00",
    recipeIndication: "約30分",
    recipeCost: "300円前後",
    recipeMaterial: [
      "卵 3個",
      "ご飯 200g",
      "玉ねぎ 1/2個",
      "ケチャップ 大さじ3",
      "バター 10g",
      "塩こしょう 少々",
      "牛乳 大さじ2",
    ],
    recipeInstructions: [
      "玉ねぎをみじん切りにする",
      "フライパンでバターを熱し、玉ねぎを炒める",
      "ご飯とケチャップを加えて混ぜ合わせる",
      "卵に牛乳を加えて溶く",
      "別のフライパンで卵を焼き、ご飯を包む",
    ],
    nickname: "料理初心者A",
    pickup: 1,
    rank: "1",
  },
  {
    recipeId: 1180006595,
    categoryId: "15-185",
    recipeTitle: "基本の肉じゃが",
    recipeUrl: "https://recipe.rakuten.co.jp/recipe/1180006595/",
    foodImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example2.jpg",
    mediumImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example2.jpg?thum=54",
    smallImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example2.jpg?thum=55",
    recipeDescription: "家庭の定番料理、肉じゃがです。ほっこり美味しい味わい。",
    recipePublishday: "2024/10/28 14:20:00",
    recipeIndication: "約45分",
    recipeCost: "500円前後",
    recipeMaterial: [
      "牛肉薄切り 200g",
      "じゃがいも 3個",
      "玉ねぎ 1個",
      "にんじん 1本",
      "糸こんにゃく 100g",
      "☆醤油 大さじ3",
      "☆みりん 大さじ3",
      "☆砂糖 大さじ2",
      "☆だし汁 300ml",
      "サラダ油 大さじ1",
    ],
    recipeInstructions: [
      "じゃがいも、にんじんは一口大に切る",
      "玉ねぎはくし切りにする",
      "鍋に油を熱し、牛肉を炒める",
      "野菜を加えて炒め、☆を加える",
      "落とし蓋をして20分煮込む",
    ],
    nickname: "和食マスター",
    pickup: 1,
    rank: "2",
  },
  {
    recipeId: 1180006596,
    categoryId: "17-221",
    recipeTitle: "ふわふわパンケーキ",
    recipeUrl: "https://recipe.rakuten.co.jp/recipe/1180006596/",
    foodImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example3.jpg",
    mediumImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example3.jpg?thum=54",
    smallImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example3.jpg?thum=55",
    recipeDescription: "ふわふわ食感のパンケーキ。朝食やおやつに最適です。",
    recipePublishday: "2024/11/05 09:15:00",
    recipeIndication: "約20分",
    recipeCost: "200円前後",
    recipeMaterial: [
      "ホットケーキミックス 150g",
      "卵 1個",
      "牛乳 100ml",
      "砂糖 大さじ1",
      "バター 適量",
      "メープルシロップ お好みで",
    ],
    recipeInstructions: [
      "ボウルに卵、牛乳、砂糖を入れて混ぜる",
      "ホットケーキミックスを加えてさっくり混ぜる",
      "フライパンにバターを熱する",
      "生地を流し入れ、弱火で焼く",
      "表面がぷつぷつしたら裏返す",
    ],
    nickname: "スイーツ好き",
    pickup: 0,
    rank: "5",
  },
  {
    recipeId: 1180006597,
    categoryId: "30-166",
    recipeTitle: "トマトとベーコンのパスタ",
    recipeUrl: "https://recipe.rakuten.co.jp/recipe/1180006597/",
    foodImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example4.jpg",
    mediumImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example4.jpg?thum=54",
    smallImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example4.jpg?thum=55",
    recipeDescription: "シンプルで美味しいトマトソースパスタです。",
    recipePublishday: "2024/11/03 12:45:00",
    recipeIndication: "約25分",
    recipeCost: "400円前後",
    recipeMaterial: [
      "パスタ 200g",
      "ベーコン 3枚",
      "玉ねぎ 1/2個",
      "トマト缶 1缶",
      "にんにく 1片",
      "オリーブオイル 大さじ2",
      "塩 適量",
      "こしょう 適量",
      "粉チーズ お好みで",
    ],
    recipeInstructions: [
      "パスタを茹で始める",
      "にんにくをみじん切り、玉ねぎとベーコンを切る",
      "オリーブオイルでにんにくを炒める",
      "玉ねぎとベーコンを加えて炒める",
      "トマト缶を加えて煮込み、茹でたパスタと和える",
    ],
    nickname: "イタリアン太郎",
    pickup: 1,
    rank: "3",
  },
  {
    recipeId: 1180006598,
    categoryId: "19-236",
    recipeTitle: "鶏の照り焼き",
    recipeUrl: "https://recipe.rakuten.co.jp/recipe/1180006598/",
    foodImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example5.jpg",
    mediumImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example5.jpg?thum=54",
    smallImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example5.jpg?thum=55",
    recipeDescription:
      "甘辛いタレが絶品の鶏の照り焼きです。ご飯によく合います。",
    recipePublishday: "2024/10/30 18:00:00",
    recipeIndication: "約20分",
    recipeCost: "300円前後",
    recipeMaterial: [
      "鶏もも肉 1枚",
      "☆醤油 大さじ2",
      "☆みりん 大さじ2",
      "☆砂糖 大さじ1",
      "☆酒 大さじ1",
      "サラダ油 小さじ1",
    ],
    recipeInstructions: [
      "鶏肉は余分な脂を取り除く",
      "☆の調味料を混ぜ合わせておく",
      "フライパンに油を熱し、鶏肉を皮目から焼く",
      "両面焼いたら、☆のタレを加える",
      "タレを絡めながら照りが出るまで焼く",
    ],
    nickname: "鶏肉大好き",
    pickup: 1,
    rank: "4",
  },
  {
    recipeId: 1180006599,
    categoryId: "14-172",
    recipeTitle: "豆腐ハンバーグ",
    recipeUrl: "https://recipe.rakuten.co.jp/recipe/1180006599/",
    foodImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example6.jpg",
    mediumImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example6.jpg?thum=54",
    smallImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example6.jpg?thum=55",
    recipeDescription:
      "ヘルシーな豆腐ハンバーグ。ふわふわ食感でカロリー控えめです。",
    recipePublishday: "2024/11/02 17:30:00",
    recipeIndication: "約30分",
    recipeCost: "350円前後",
    recipeMaterial: [
      "豆腐 1丁",
      "鶏ひき肉 200g",
      "玉ねぎ 1/2個",
      "パン粉 大さじ3",
      "卵 1個",
      "塩こしょう 少々",
      "☆醤油 大さじ2",
      "☆みりん 大さじ2",
      "☆砂糖 大さじ1",
    ],
    recipeInstructions: [
      "豆腐は水切りし、玉ねぎはみじん切りにする",
      "豆腐、ひき肉、玉ねぎ、パン粉、卵を混ぜる",
      "塩こしょうで味付けし、形を整える",
      "フライパンで両面を焼く",
      "☆のタレを加えて絡める",
    ],
    nickname: "ヘルシー志向",
    pickup: 0,
    rank: "8",
  },
  {
    recipeId: 1180006600,
    categoryId: "23-251",
    recipeTitle: "きのこのバター醤油炒め",
    recipeUrl: "https://recipe.rakuten.co.jp/recipe/1180006600/",
    foodImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example7.jpg",
    mediumImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example7.jpg?thum=54",
    smallImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example7.jpg?thum=55",
    recipeDescription: "きのこの旨味たっぷり。簡単に作れる副菜です。",
    recipePublishday: "2024/10/25 16:20:00",
    recipeIndication: "約10分",
    recipeCost: "200円前後",
    recipeMaterial: [
      "しめじ 1パック",
      "エリンギ 2本",
      "バター 10g",
      "醤油 大さじ1",
      "にんにく 1片",
      "塩こしょう 少々",
    ],
    recipeInstructions: [
      "きのこ類は食べやすい大きさに切る",
      "にんにくはみじん切りにする",
      "フライパンにバターを熱し、にんにくを炒める",
      "きのこを加えて炒める",
      "醤油と塩こしょうで味付ける",
    ],
    nickname: "きのこ農家",
    pickup: 0,
    rank: "12",
  },
  {
    recipeId: 1180006601,
    categoryId: "16-203",
    recipeTitle: "さばの味噌煮",
    recipeUrl: "https://recipe.rakuten.co.jp/recipe/1180006601/",
    foodImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example8.jpg",
    mediumImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example8.jpg?thum=54",
    smallImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example8.jpg?thum=55",
    recipeDescription: "和食の定番、さばの味噌煮。生姜の香りが効いています。",
    recipePublishday: "2024/10/27 13:10:00",
    recipeIndication: "約25分",
    recipeCost: "400円前後",
    recipeMaterial: [
      "さば 2切れ",
      "☆味噌 大さじ2",
      "☆砂糖 大さじ2",
      "☆みりん 大さじ2",
      "☆酒 大さじ2",
      "☆水 100ml",
      "しょうが 1片",
      "長ねぎ 1本",
    ],
    recipeInstructions: [
      "さばに熱湯をかけて臭みを取る",
      "しょうがは薄切り、ねぎは斜め切りにする",
      "鍋に☆を入れて煮立たせる",
      "さば、しょうが、ねぎを加える",
      "落とし蓋をして15分煮込む",
    ],
    nickname: "魚好き主婦",
    pickup: 1,
    rank: "6",
  },
  {
    recipeId: 1180006602,
    categoryId: "31-350",
    recipeTitle: "野菜たっぷりカレー",
    recipeUrl: "https://recipe.rakuten.co.jp/recipe/1180006602/",
    foodImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example9.jpg",
    mediumImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example9.jpg?thum=54",
    smallImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example9.jpg?thum=55",
    recipeDescription: "野菜がたっぷり入ったヘルシーカレーです。",
    recipePublishday: "2024/11/06 19:00:00",
    recipeIndication: "約50分",
    recipeCost: "600円前後",
    recipeMaterial: [
      "豚肉 200g",
      "玉ねぎ 2個",
      "にんじん 1本",
      "じゃがいも 2個",
      "なす 1本",
      "カレールー 1/2箱",
      "水 600ml",
      "サラダ油 大さじ1",
    ],
    recipeInstructions: [
      "野菜と肉を一口大に切る",
      "鍋に油を熱し、肉を炒める",
      "野菜を加えて炒める",
      "水を加えて20分煮込む",
      "カレールーを加えて溶かす",
    ],
    nickname: "カレー研究家",
    pickup: 1,
    rank: "7",
  },
  {
    recipeId: 1180006603,
    categoryId: "23-248",
    recipeTitle: "ほうれん草のおひたし",
    recipeUrl: "https://recipe.rakuten.co.jp/recipe/1180006603/",
    foodImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example10.jpg",
    mediumImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example10.jpg?thum=54",
    smallImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example10.jpg?thum=55",
    recipeDescription: "シンプルで美味しい定番の副菜です。",
    recipePublishday: "2024/10/24 11:30:00",
    recipeIndication: "約10分",
    recipeCost: "150円前後",
    recipeMaterial: [
      "ほうれん草 1束",
      "☆醤油 大さじ1",
      "☆みりん 大さじ1",
      "☆だし汁 大さじ2",
      "かつお節 適量",
    ],
    recipeInstructions: [
      "ほうれん草を茹でる",
      "冷水にとって絞る",
      "食べやすい大きさに切る",
      "☆を混ぜ合わせてかける",
      "かつお節をのせる",
    ],
    nickname: "和食の基本",
    pickup: 0,
    rank: "15",
  },
  {
    recipeId: 1180006604,
    categoryId: "30-166",
    recipeTitle: "チャーハン",
    recipeUrl: "https://recipe.rakuten.co.jp/recipe/1180006604/",
    foodImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example11.jpg",
    mediumImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example11.jpg?thum=54",
    smallImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example11.jpg?thum=55",
    recipeDescription: "パラパラに仕上がるチャーハンのレシピです。",
    recipePublishday: "2024/11/04 12:00:00",
    recipeIndication: "約15分",
    recipeCost: "250円前後",
    recipeMaterial: [
      "ご飯 300g",
      "卵 2個",
      "長ねぎ 1/2本",
      "ハム 3枚",
      "☆醤油 大さじ1",
      "☆鶏がらスープの素 小さじ1",
      "サラダ油 大さじ2",
      "塩こしょう 少々",
    ],
    recipeInstructions: [
      "ねぎとハムをみじん切りにする",
      "フライパンに油を熱し、卵を炒める",
      "ご飯を加えて炒める",
      "ねぎとハムを加える",
      "☆と塩こしょうで味付ける",
    ],
    nickname: "中華の達人",
    pickup: 0,
    rank: "9",
  },
  {
    recipeId: 1180006605,
    categoryId: "14-172",
    recipeTitle: "麻婆豆腐",
    recipeUrl: "https://recipe.rakuten.co.jp/recipe/1180006605/",
    foodImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example12.jpg",
    mediumImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example12.jpg?thum=54",
    smallImageUrl:
      "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example12.jpg?thum=55",
    recipeDescription: "ピリ辛で美味しい麻婆豆腐。ご飯が進みます。",
    recipePublishday: "2024/10/29 18:45:00",
    recipeIndication: "約20分",
    recipeCost: "350円前後",
    recipeMaterial: [
      "豆腐 1丁",
      "豚ひき肉 150g",
      "長ねぎ 1/2本",
      "にんにく 1片",
      "しょうが 1片",
      "☆豆板醤 小さじ1",
      "☆味噌 大さじ1",
      "☆醤油 大さじ1",
      "☆鶏がらスープ 150ml",
      "☆砂糖 小さじ1",
      "水溶き片栗粉 適量",
      "ごま油 小さじ1",
    ],
    recipeInstructions: [
      "豆腐は一口大に切り、水切りする",
      "にんにく、しょうが、ねぎをみじん切りにする",
      "フライパンでひき肉を炒める",
      "にんにく、しょうが、豆板醤を加えて炒める",
      "☆と豆腐を加えて煮込み、水溶き片栗粉でとろみをつける",
    ],
    nickname: "中華マニア",
    pickup: 1,
    rank: "10",
  },
];

// ========================
// カテゴリデータ
// ========================
export const mockCategories = {
  large: [
    {
      categoryId: "30",
      categoryName: "人気メニュー",
      categoryUrl: "https://recipe.rakuten.co.jp/category/30/",
    },
    {
      categoryId: "10",
      categoryName: "肉料理",
      categoryUrl: "https://recipe.rakuten.co.jp/category/10/",
    },
    {
      categoryId: "14",
      categoryName: "豆腐・大豆製品",
      categoryUrl: "https://recipe.rakuten.co.jp/category/14/",
    },
    {
      categoryId: "15",
      categoryName: "野菜料理",
      categoryUrl: "https://recipe.rakuten.co.jp/category/15/",
    },
    {
      categoryId: "16",
      categoryName: "魚料理",
      categoryUrl: "https://recipe.rakuten.co.jp/category/16/",
    },
    {
      categoryId: "17",
      categoryName: "お菓子",
      categoryUrl: "https://recipe.rakuten.co.jp/category/17/",
    },
    {
      categoryId: "19",
      categoryName: "鶏肉料理",
      categoryUrl: "https://recipe.rakuten.co.jp/category/19/",
    },
    {
      categoryId: "23",
      categoryName: "野菜のおかず",
      categoryUrl: "https://recipe.rakuten.co.jp/category/23/",
    },
    {
      categoryId: "31",
      categoryName: "カレー",
      categoryUrl: "https://recipe.rakuten.co.jp/category/31/",
    },
  ],
  medium: [
    {
      categoryId: "166",
      categoryName: "オムライス",
      parentCategoryId: "30",
      categoryUrl: "https://recipe.rakuten.co.jp/category/30-166/",
    },
    {
      categoryId: "172",
      categoryName: "豆腐",
      parentCategoryId: "14",
      categoryUrl: "https://recipe.rakuten.co.jp/category/14-172/",
    },
    {
      categoryId: "185",
      categoryName: "肉じゃが",
      parentCategoryId: "15",
      categoryUrl: "https://recipe.rakuten.co.jp/category/15-185/",
    },
    {
      categoryId: "203",
      categoryName: "さば",
      parentCategoryId: "16",
      categoryUrl: "https://recipe.rakuten.co.jp/category/16-203/",
    },
    {
      categoryId: "221",
      categoryName: "パンケーキ",
      parentCategoryId: "17",
      categoryUrl: "https://recipe.rakuten.co.jp/category/17-221/",
    },
    {
      categoryId: "236",
      categoryName: "照り焼きチキン",
      parentCategoryId: "19",
      categoryUrl: "https://recipe.rakuten.co.jp/category/19-236/",
    },
    {
      categoryId: "248",
      categoryName: "ほうれん草",
      parentCategoryId: "23",
      categoryUrl: "https://recipe.rakuten.co.jp/category/23-248/",
    },
    {
      categoryId: "251",
      categoryName: "きのこ",
      parentCategoryId: "23",
      categoryUrl: "https://recipe.rakuten.co.jp/category/23-251/",
    },
    {
      categoryId: "350",
      categoryName: "野菜カレー",
      parentCategoryId: "31",
      categoryUrl: "https://recipe.rakuten.co.jp/category/31-350/",
    },
  ],
};

// ========================
// ユーザーデータ（Firestore構造に合わせる）
// ========================
export const mockUser = {
  uid: "mock-user-001",
  name: "田中太郎",
  email: "tanaka@example.com",
  favorites: [
    {
      recipeId: "1180006594",
      title: "簡単ふわふわオムライス",
      image:
        "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example1.jpg?thum=55",
    },
    {
      recipeId: "1180006597",
      title: "トマトとベーコンのパスタ",
      image:
        "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example4.jpg?thum=55",
    },
    {
      recipeId: "1180006598",
      title: "鶏の照り焼き",
      image:
        "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example5.jpg?thum=55",
    },
    {
      recipeId: "1180006602",
      title: "野菜たっぷりカレー",
      image:
        "https://image.space.rakuten.co.jp/d/strg/ctrl/3/example9.jpg?thum=55",
    },
  ],
  histories: [
    {
      recipeId: "1180006599",
      title: "豆腐ハンバーグ",
      date: "2024-11-15",
    },
    {
      recipeId: "1180006594",
      title: "簡単ふわふわオムライス",
      date: "2024-11-14",
    },
    {
      recipeId: "1180006604",
      title: "チャーハン",
      date: "2024-11-13",
    },
    {
      recipeId: "1180006598",
      title: "鶏の照り焼き",
      date: "2024-11-12",
    },
    {
      recipeId: "1180006601",
      title: "さばの味噌煮",
      date: "2024-11-11",
    },
    {
      recipeId: "1180006595",
      title: "基本の肉じゃが",
      date: "2024-11-10",
    },
    {
      recipeId: "1180006602",
      title: "野菜たっぷりカレー",
      date: "2024-11-09",
    },
  ],
  createdAt: "2024-10-01T10:00:00Z",
};

// ========================
// ヘルパー関数
// ========================

/**
 * 食材検索：入力した食材でレシピを検索する
 * @param {string[]} ingredients - 検索する食材の配列（例: ["卵", "牛乳", "玉ねぎ"]）
 * @returns {Array} マッチしたレシピの配列（足りない食材情報付き）
 */
export const searchRecipesByIngredients = (ingredients) => {
  return (
    mockRecipes
      .map((recipe) => {
        // 材料から食材名のみを抽出（分量を除外）
        const recipeIngredients = recipe.recipeMaterial.map((material) => {
          // "卵 3個" → "卵" のように抽出
          return material.split(" ")[0].replace(/☆/g, "");
        });

        // マッチした食材と不足している食材を計算
        const matchedIngredients = ingredients.filter((ing) =>
          recipeIngredients.some((recipeIng) => recipeIng.includes(ing))
        );

        const missingIngredients = recipeIngredients.filter(
          (recipeIng) => !ingredients.some((ing) => recipeIng.includes(ing))
        );

        // マッチ度を計算（マッチした食材数 / 必要な食材数）
        const matchRate = matchedIngredients.length / recipeIngredients.length;

        return {
          ...recipe,
          matchedIngredients,
          missingIngredients,
          matchRate,
          canMake: missingIngredients.length === 0,
        };
      })
      // マッチ度の高い順にソート
      .sort((a, b) => b.matchRate - a.matchRate)
  );
};

/**
 * レシピIDから詳細を取得
 * @param {string|number} recipeId
 * @returns {Object|null} レシピオブジェクト
 */
export const getRecipeById = (recipeId) => {
  return mockRecipes.find((recipe) => recipe.recipeId == recipeId) || null;
};

/**
 * カテゴリIDからレシピを取得
 * @param {string} categoryId
 * @returns {Array} レシピの配列
 */
export const getRecipesByCategory = (categoryId) => {
  return mockRecipes.filter((recipe) =>
    recipe.categoryId.startsWith(categoryId)
  );
};

/**
 * お気に入りレシピの詳細を取得
 * @param {Array} favorites - お気に入り配列
 * @returns {Array} レシピ詳細の配列
 */
export const getFavoriteRecipesDetails = (favorites) => {
  return favorites.map((fav) => getRecipeById(fav.recipeId)).filter(Boolean);
};

/**
 * 履歴からレシピ詳細を取得
 * @param {Array} histories - 履歴配列
 * @returns {Array} レシピ詳細の配列
 */
export const getHistoryRecipesDetails = (histories) => {
  return histories
    .map((hist) => ({
      ...getRecipeById(hist.recipeId),
      cookedDate: hist.date,
    }))
    .filter((recipe) => recipe.recipeId);
};
