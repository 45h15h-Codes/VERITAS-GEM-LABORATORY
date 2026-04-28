<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate - {{ $certificate->certificate_number }}</title>
    <style>
        @page {
            margin: 0;
            size: 800px 1100px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Playfair Display', serif;
            width: 800px;
            height: 1100px;
            position: relative;
            overflow: hidden;
            color: #333;
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

        .content-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding: 0;
        }

        .text-paragraphs {
            position: absolute;
            top: 295px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            text-align: left;
            font-family: 'Lato', sans-serif;
            font-weight: 400;
            font-size: 18px;
            line-height: 1.6;
            color: #333;
        }

        .text-paragraphs p {
            margin-bottom: 20px;
        }

        .text-paragraphs strong {
            font-weight: 700;
        }

        .notice strong {
            font-weight: 700;
        }

        .notice.text-center {
            text-align: center;
        }

        .notice.mt-5 {
            margin-top: 50px;
        }

        .text-danger {
            color: #dc3545;
        }

        .details-block {
            position: absolute;
            bottom: 125px;
            left: 78px;
            text-align: left;
            font-family: Georgia, 'Times New Roman', Times, serif;
            font-weight: 400;
            font-size: 22px;
            line-height: 1.7;
            color: #333;
        }

        .details-block span {
            font-weight: 400;
        }

        .hologram-sticker-placement {
            position: absolute;
            bottom: 475px;
            /* top: 40rem; */
            left: 475px;
            width: 190px;
            height: 190px;
            overflow: hidden;
        }

        .cert-hologram {
            width: 100px;
            height: 100px;
            object-fit: cover;
            /* opacity: 0.9; */
        }
    </style>
</head>

<body>
    <!-- Background Image -->
    <img src="{{ $backgroundPath }}" class="background-image" alt="Background">

    <div class="content-overlay">
        <div class="text-paragraphs">
            <p>
                We proudly certify that this jewelry piece
                <strong>{{ $certificate->item }}</strong> is
                @if($certificate->type !== 'diamond')
                    crafted from <strong>{{ $certificate->metal_purity }}</strong> and
                @endif
                adorned with genuine <strong>{{ $certificate->gem_stone }}</strong>.
            </p>

            <p>
                The main gemstone weighs <strong>{{ $certificate->carat_weight }}</strong> carats,
                featuring a <strong>{{ $certificate->color }}</strong> color and
                <strong>{{ $certificate->clarity }}</strong> clarity, ensuring unmatched brilliance and beauty.
                @if($certificate->type === 'diamond')
                    <br>The diamond has a width of <strong>{{ $certificate->weight }}</strong>.
                @endif
            </p>

            <p>
                This certificate guarantees the <strong>authenticity</strong> and
                <strong>superior quality</strong> of all materials, verified by a certified gemologist.
            </p>
            <br>

            <p class="notice">
                <strong class="text-danger" style="color: red;">Our Promise:</strong>
                All our diamonds are <strong>100% conflict-free</strong> and
                <strong>ethically sourced</strong>, crafted with integrity and sustainability.
                <br>
                <span class="hologram-sticker-placement">
                    <img src="{{ public_path('images/VGL-HOLO.png') }}" class="cert-hologram" alt="Hologram Sticker">
                </span>
            </p>

            <p class="notice text-center mt-5">
                <strong class="text-danger" style="color: red;">
                    *** ELECTRONIC COPY - DO NOT RELY SOLELY ON THIS DOCUMENT ***
                </strong>
            </p>
        </div>

        <div class="details-block">
            Name: <strong>{{ $certificate->certifier_name ?? '--' }}</strong><br>
            Certificate No: <strong>{{ $certificate->certificate_number }}</strong><br>
            Date: <strong>{{ \Carbon\Carbon::parse($certificate->date)->format('F d, Y') }}</strong>
        </div>
    </div>
</body>

</html>