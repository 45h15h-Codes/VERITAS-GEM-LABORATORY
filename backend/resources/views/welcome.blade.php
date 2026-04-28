<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="{{ asset('images/VGL-LOGO.svg') }}">
    <title>The Diamond Journey - Refined Luxury</title>
    <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500&display=swap"
        rel="stylesheet" />
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #fafafa;
            color: #222;
            overflow-x: hidden;
        }

        header {
            text-align: center;
            padding: 5rem 2rem 3rem;
            background: linear-gradient(135deg, #fff 0%, #f4f4f8 100%);
        }

        header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 3rem;
            color: #111;
            margin-bottom: 1rem;
        }

        header p {
            font-size: 1.2rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
        }

        .section {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 3rem;
            padding: 6rem 5%;
            max-width: 1300px;
            margin: auto;
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.8s ease;
        }

        .section.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .section:nth-child(even) {
            flex-direction: row-reverse;
            background: #fff;
        }

        .section img {
            width: 45%;
            border-radius: 14px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            object-fit: cover;
        }

        .section-content {
            width: 50%;
        }

        .section-content h2 {
            font-family: 'Playfair Display', serif;
            font-size: 2.3rem;
            color: #111;
            margin-bottom: 1rem;
        }

        .section-content p {
            color: #444;
            font-size: 1.1rem;
            line-height: 1.8;
            margin-bottom: 1.2rem;
        }

        .cta {
            text-align: center;
            padding: 5rem 2rem;
            background: linear-gradient(135deg, #111 0%, #333 100%);
            color: #fff;
        }

        .cta h3 {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            margin-bottom: 1rem;
        }

        .cta p {
            max-width: 600px;
            margin: 0 auto 2rem;
            font-size: 1.1rem;
            color: #ddd;
        }

        .cta a {
            background: linear-gradient(135deg, #666eea 0%, #764ba2 100%);
            padding: 1rem 2.5rem;
            border-radius: 50px;
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: 0.3s;
        }

        .cta a:hover {
            opacity: 0.9;
            transform: translateY(-3px);
        }

        footer {
            text-align: center;
            padding: 2rem;
            font-size: 0.9rem;
            color: #666;
            border-top: 1px solid #eee;
        }

        @media (max-width: 900px) {
            .section {
                flex-direction: column !important;
                text-align: center;
            }

            .section img,
            .section-content {
                width: 90%;
            }

            header h1 {
                font-size: 2.2rem;
            }
        }
    </style>
</head>

<body>

    <header>
        <h1>The Extraordinary Journey of a Diamond</h1>
        <p>From Earth's fiery depths to the brilliance of Surat's master craftsmen  witness a billion-year
            transformation.</p>
    </header>

    <!-- Chapter 1 -->
    <section class="section">
        <img src="https://images.unsplash.com/photo-1663417843649-6e8c32af9a61?auto=format&fit=crop&q=80&w=1170"
            alt="Diamond Formation">
        <div class="section-content">
            <h2>Birth of a Diamond</h2>
            <p>Billions of years ago, deep within Earth's mantle, carbon atoms bonded under extreme heat and pressure,
                forming the hardest natural substance  the diamond.</p>
            <p>Each diamond is a time capsule  carrying Earth's geological secrets within its core.</p>
        </div>
    </section>

    <!-- Chapter 2 -->
    <section class="section">
        <img src="https://images.unsplash.com/photo-1596279691646-51b6cce35274?auto=format&fit=crop&q=80&w=1074"
            alt="Diamond Mining">
        <div class="section-content">
            <h2>Discovery and Mining</h2>
            <p>Volcanic eruptions brought these precious crystals closer to the surface through kimberlite pipes 
                today’s primary mining sites.</p>
            <p>From African plains to Russian tundras, miners uncover the hidden brilliance of the Earth.</p>
        </div>
    </section>

    <!-- Chapter 3 -->
    <section class="section">
        <img src="https://diamond101.com/wp-content/uploads/factors-impacting-diamonds-cut-735x413.jpg.webp"
            alt="Sorting Diamonds">
        <div class="section-content">
            <h2>From Mines to Sorting Centers</h2>
            <p>After extraction, rough diamonds are sent to global sorting hubs like Antwerp and Mumbai, where experts
                classify them by carat, clarity, color, and cut  the Four Cs of perfection.</p>
        </div>
    </section>

    <!-- Chapter 4 -->
    <section class="section">
        <img src="https://diamondexchangehouston.com/wp-content/uploads/2023/06/Diamond-Tester-1080x630.jpg"
            alt="Diamond Testing Lab">
        <div class="section-content">
            <h2>Scientific Grading and Testing</h2>
            <p>Each diamond undergoes rigorous examination using advanced gemological technology to ensure authenticity,
                quality, and brilliance.</p>
        </div>
    </section>

    <!-- Chapter 5 -->
    <section class="section">
        <img src="https://www.suratdiamondbourse.in/wp-content/uploads/2025/07/ext2.jpg" alt="Surat Diamond Cutting">
        <div class="section-content">
            <h2>The Surat Transformation</h2>
            <p>In Surat, the world’s diamond capital of India, skilled artisans craft raw stones into masterpieces, each facet
                cut to perfection, each sparkle born from precision and passion.</p>
        </div>
    </section>

    <!-- Chapter 6 -->
    <section class="section">
        <img src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1175"
            alt="Diamond Jewelry">
        <div class="section-content">
            <h2>Setting into Jewelry</h2>
            <p>Polished diamonds find their eternal homes in rings, necklaces, and crowns  immortal symbols of love and
                success.</p>
        </div>
    </section>

    <!-- Epilogue -->
    <section class="section">
        <img src="https://dropinblog.net/cdn-cgi/image/fit=scale-down,width=700/34239851/files/featured/The_Journey_of_a_Diamond.png"
            alt="Diamond Sparkle">
        <div class="section-content">
            <h2>From Earth's Core to Your Heart</h2>
            <p>Every diamond tells a billion-year story  of fire, pressure, and artistry. From nature’s depths to your
                fingertips, it embodies timeless elegance.</p>
        </div>
    </section>

    <!-- CTA -->
    <div class="cta">
        <h3>Explore the Legacy of Surat's Diamonds</h3>
        <p>Journey through centuries of craftsmanship and discover how Surat transformed into the world's diamond
            cutting capital, processing 90% of the world's diamonds.</p>
        <a href="https://theminimalcarbon.com/" target="_blank"
            style="
            display: inline-block;
            background: linear-gradient(135deg, #222 0%, #666 100%);
            color: #fff;
            padding: 1rem 2.5rem;
            border-radius: 50px;
            font-family: 'Inter', sans-serif;
            font-size: 1.1rem;
            font-weight: 500;
            letter-spacing: 0.03em;
            box-shadow: 0 4px 18px rgba(34, 34, 34, 0.12);
            text-decoration: none;
            transition: background 0.3s, transform 0.2s;
        ">
            <span style="display: inline-block; vertical-align: middle;">
                Discover Our Heritage
            </span>
            <svg style="vertical-align: middle; margin-left: 0.7em;" width="22" height="22" fill="none"
                stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 11h12M13 7l4 4-4 4" />
            </svg>
        </a>
    </div>

    <footer>
        © 2025 The Diamond Journey | Crafted with Passion in Surat
    </footer>

    <script>
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, {
            threshold: 0.2
        });
        document.querySelectorAll('.section').forEach(sec => observer.observe(sec));
    </script>
</body>

</html>
