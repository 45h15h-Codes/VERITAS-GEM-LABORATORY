<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate - {{ $certificate->certificate_number }}</title>
    <style>
        @page {
            margin: 0;
            size: 1100px 800px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Lato', 'Arial', sans-serif;
            width: 1100px;
            height: 800px;
            position: relative;
            overflow: hidden;
        }

        .background-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            object-fit: cover;
        }

        .certificate-field {
            position: absolute;
            font-size: 18px;
            font-weight: 500;
            color: #111;
            text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
        }

        .cert-title {
            top: 80px;
            font-family: "Times New Roman", Times, serif;
            left: 50%;
            transform: translateX(-50%);
            font-size: 28px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-align: center;
            width: 100%;
        }

        .cert-header-info {
            position: absolute;
            top: 170px;
            left: 50%;
            transform: translateX(-50%);
            /* width: 50%; */
            display: flex;
            /* justify-content: ; */
            font-family: 'Lato', sans-serif;
            font-size: 18px;
        }

        .cert-header-info strong {
            font-weight: bold;
            margin-right: 5px;
        }

        .item {
            top: 220px;
            left: 100px;
        }

        .length {
            top: 260px;
            left: 100px;
        }

        .weight {
            top: 300px;
            left: 100px;
        }

        .gemstone {
            top: 340px;
            left: 100px;
        }

        .carat {
            top: 380px;
            left: 100px;
        }

        .color {
            top: 420px;
            left: 100px;
        }

        .clarity {
            top: 460px;
            left: 100px;
        }

        .metal {
            top: 500px;
            left: 100px;
        }

        .value {
            top: 540px;
            left: 100px;
        }

        .cert-image {
            position: absolute;
            top: 220px;
            right: 100px;
            width: 350px;
            height: 280px;
            object-fit: cover;
            border: 2px solid #ddd;
            background: #fff;
        }

        .hologram-sticker-placement-c1 {
            position: absolute;
            bottom: 5rem;
            right: 38rem;
            width: 12rem;
            height: 12rem;
        }

        .cert-hologram-c1 {
            width: 120px;
            height: 120px;
            object-fit: cover;
            position: relative;
            /* bottom: -10px; */
            top: 15px;
            /* opacity: 0.85; */
        }

        .e-copy-warning {
            position: absolute;
            /* bottom: 30px; */
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            color: red;
            /* font-size: 14px; */
            font-weight: bold;
            text-align: center;
            width: 100%;
        }

        .cert-number {
            margin-right: 6 0px;
            font-family: "Times New Roman", Times, serif
        }

        .cert-date {
            margin-left: 60px;
            font-family: "Times New Roman", Times, serif
        }
    </style>
</head>

<body>
    <!-- SVG Background Image -->
    <img src="{{ public_path('images/template_1.png') }}" class="background-image" alt="Background">

    <div class="certificate-field cert-title text-center">
        @if(isset($certificate) && $certificate->type === 'diamond')
            Diamond Authenticity Certificate
        @else
            Jewelry Authenticity Certificate
        @endif
    </div>

    <div class="cert-header-info">
        <span class="cert-number">
            <strong>Certificate #:</strong>
            {{ $certificate->certificate_number }}
        </span>
        <span class="cert-date">
            <strong>Date:</strong>
            {{ \Carbon\Carbon::parse($certificate->date)->format('F d, Y') }}
        </span>
    </div>

    <span class="certificate-field item"><strong>Item:</strong> {{ $certificate->item }}</span>
    <span class="certificate-field length"><strong>Length:</strong> {{ $certificate->length }}</span>
    <span class="certificate-field weight">
        <strong>{{ $certificate->type === 'diamond' ? 'Width:' : 'Weight:' }}</strong>
        {{ $certificate->weight }}
    </span>
    <span class="certificate-field gemstone"><strong>Gemstone:</strong> {{ $certificate->gem_stone }}</span>
    <span class="certificate-field carat"><strong>Carat Weight:</strong> {{ $certificate->carat_weight }}</span>
    <span class="certificate-field color"><strong>Color:</strong> {{ $certificate->color }}</span>
    <span class="certificate-field clarity"><strong>Clarity:</strong> {{ $certificate->clarity }}</span>
    @if($certificate->type !== 'diamond')
        <span class="certificate-field metal"><strong>Metal Purity:</strong> {{ $certificate->metal_purity }}</span>
    @endif

    @if ($certificate->image)
        @php
            $imagePath = str_starts_with($certificate->image, 'http://') || str_starts_with($certificate->image, 'https://')
                ? $certificate->image
                : (str_starts_with($certificate->image, 'uploads/')
                    ? public_path($certificate->image)
                    : storage_path('app/public/' . $certificate->image));
        @endphp
        <img src="{{ $imagePath }}" class="cert-image" alt="Jewelry">
    @endif

    <div class="hologram-sticker-placement-c1">
        <img src="{{ public_path('images/VGL-HOLO.png') }}" class="cert-hologram-c1" alt="Hologram Sticker">
    </div>

    <div class="e-copy-warning">
        *** ELECTRONIC COPY - PLEASE REFER TO THE OFFICIAL PHYSICAL CERTIFICATE ***
    </div>
</body>

</html>