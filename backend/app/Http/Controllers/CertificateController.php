<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\CrmOrder;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;

class CertificateController extends Controller
{
    public function index()
    {
        $certificates = Certificate::leftJoin('stores', 'certificates.store', '=', 'stores.id')
            ->select('certificates.*', 'stores.name as store_name')
            ->orderBy('certificates.id', 'DESC')
            ->get();
        return Response::json($certificates, 200);
    }

    public function store(Request $request)
    {
        // Image is required unless an image_url (Cloudinary) is provided
        $imageRule = $request->filled('image_url') ? 'nullable' : 'required';

        $validator = Validator::make($request->all(), [
            'certificate_number' => 'required|string|unique:certificates,certificate_number',
            'type' => 'required|in:diamond,jewellery',
            'certifier_name' => 'required',
            'image' => $imageRule . '|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_url' => 'nullable|url|max:500',
            'title' => 'required',
            'store' => 'required',
            'date' => 'required|date',
            'item' => 'required',
            'length' => 'required',
            'weight' => 'required',
            'carat_weight' => 'required',
            'gem_stone' => 'required',
            'color' => 'required',
            'clarity' => 'required',
            'metal_purity' => $request->type === 'diamond' ? 'nullable' : 'required',
            'value' => 'required|numeric',
            'crm_order_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return Response::json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except(['image_url', 'crm_order_id']);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $originalName = $image->getClientOriginalName();
            $extension = $image->getClientOriginalExtension();
            $cleanName = Str::slug(pathinfo($originalName, PATHINFO_FILENAME));
            $filename = time() . '_' . $cleanName . '.' . $extension;
            $image->move(public_path('uploads/certificates'), $filename);
            $data['image'] = 'uploads/certificates/' . $filename;
        } elseif ($request->filled('image_url')) {
            // Download image from Cloudinary URL and save locally
            try {
                $imageContent = file_get_contents($request->image_url);
                $extension = pathinfo(parse_url($request->image_url, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';
                $filename = time() . '_crm_' . uniqid() . '.' . $extension;
                $uploadPath = public_path('uploads/certificates');
                if (!is_dir($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }
                file_put_contents($uploadPath . '/' . $filename, $imageContent);
                $data['image'] = 'uploads/certificates/' . $filename;
            } catch (\Exception $e) {
                return Response::json(['errors' => ['image' => ['Failed to download image from URL: ' . $e->getMessage()]]], 422);
            }
        }

        $certificate = Certificate::create($data);

        // Link CRM order to this certificate
        if ($request->filled('crm_order_id')) {
            CrmOrder::where('crm_order_id', $request->crm_order_id)->update([
                'is_used' => true,
                'certificate_id' => $certificate->id,
            ]);
        }

        return Response::json($certificate, 201);
    }

    public function show($id)
    {
        $certificate = Certificate::find($id);
        if (!$certificate) {
            return Response::json(['message' => 'Certificate not found'], 404);
        }
        return Response::json($certificate, 200);
    }

    public function update(Request $request, $id)
    {
        $certificate = Certificate::find($id);
        if (!$certificate) {
            return Response::json(['message' => 'Certificate not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'certificate_number' => 'required|string|unique:certificates,certificate_number,' . $id,
            'type' => 'required|in:diamond,jewellery',
            'certifier_name' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'title' => 'required',
            'store' => 'required',
            'date' => 'required|date',
            'item' => 'required',
            'length' => 'required',
            'weight' => 'required',
            'carat_weight' => 'required',
            'gem_stone' => 'required',
            'color' => 'required',
            'clarity' => 'required',
            'metal_purity' => $request->type === 'diamond' ? 'nullable' : 'required',
            'value' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return Response::json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $originalName = $image->getClientOriginalName();
            $extension = $image->getClientOriginalExtension();
            $cleanName = Str::slug(pathinfo($originalName, PATHINFO_FILENAME));
            $filename = time() . '_' . $cleanName . '.' . $extension;
            $image->move(public_path('uploads/certificates'), $filename);
            $data['image'] = 'uploads/certificates/' . $filename;
        }

        $certificate->update($data);
        return Response::json($certificate, 200);
    }

    public function destroy($id)
    {
        $certificate = Certificate::find($id);
        if (!$certificate) {
            return Response::json(['message' => 'Certificate not found'], 404);
        }
        $certificate->delete();
        return Response::json(['message' => 'Certificate deleted'], 200);
    }

    public function search($certificate_number)
    {
        $certificate = Certificate::leftJoin('stores', 'certificates.store', '=', 'stores.id')
            ->select('certificates.*', 'stores.name as store_name')
            ->where('certificate_number', $certificate_number)
            ->first();
        if (!$certificate) {
            return Response::json(['message' => 'Certificate not found'], 404);
        }
        return Response::json($certificate, 200);
    }

    /**
     * Download certificate as PDF (both templates)
     */
    public function downloadPDF($id)
    {
        $certificate = Certificate::findOrFail($id);

        // Fetch Store
        $store = Store::find($certificate->store);

        // Use store template image or fallback
        $backgroundPath = public_path($store->template_image ?? 'images/VGL-2.png');

        // Generate PDF for Template 1 (Landscape)
        $pdf1 = Pdf::loadView('certificates.pdf_template1', compact('certificate'))
            ->setPaper('a4', 'landscape');

        // Generate PDF for Template 2 (Portrait)
        $pdf2 = Pdf::loadView('certificates.pdf_template2', [
            'certificate' => $certificate,
            'backgroundPath' => $backgroundPath
        ])->setPaper('a4', 'portrait');

        // For now, return the first template. To return both, you would need to merge PDFs
        // or provide separate download endpoints
        return $pdf1->download('certificate-' . $certificate->certificate_number . '-Landscape.pdf');
    }

    /**
     * Download certificate Template 1 as PDF (Landscape)
     */
    public function downloadTemplate1PDF($id)
    {
        $certificate = Certificate::findOrFail($id);

        $pdf = Pdf::loadView('certificates.pdf_template1', compact('certificate'))
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'chroot' => [public_path(), storage_path()],
            ])
            ->setPaper([0, 0, 1100, 800], 'landscape');

        return $pdf->download('certificate-' . $certificate->certificate_number . '-Landscape.pdf');
    }

    /**
     * Download certificate Template 2 as PDF (Portrait)
     */
    public function downloadTemplate2PDF($id)
    {
        $certificate = Certificate::findOrFail($id);

        // Fetch Store
        $store = Store::find($certificate->store);

        // Use store template image or fallback
        $backgroundPath = public_path($store->template_image ?? 'images/VGL-2.png');

        $pdf = Pdf::loadView('certificates.pdf_template2', [
            'certificate' => $certificate,
            'backgroundPath' => $backgroundPath
        ])
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'chroot' => [public_path(), storage_path()],
            ])
            ->setPaper([0, 0, 800, 1100], 'portrait');

        return $pdf->download('certificate-' . $certificate->certificate_number . '-Portrait.pdf');
    }

    /**
     * Stream certificate Template 1 as PDF (for preview)
     */
    public function streamTemplate1PDF($id)
    {
        $certificate = Certificate::findOrFail($id);

        $pdf = Pdf::loadView('certificates.pdf_template1', compact('certificate'))
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'chroot' => [public_path(), storage_path()],
            ])
            ->setPaper([0, 0, 1100, 800], 'landscape');

        return $pdf->stream('certificate-' . $certificate->certificate_number . '-Landscape.pdf');
    }

    /**
     * Stream certificate Template 2 as PDF (for preview)
     */
    public function streamTemplate2PDF($id)
    {
        $certificate = Certificate::findOrFail($id);

        // Fetch Store
        $store = Store::find($certificate->store);

        // Use store template image or fallback
        $backgroundPath = public_path($store->template_image ?? 'images/VGL-2.png');

        $pdf = Pdf::loadView('certificates.pdf_template2', [
            'certificate' => $certificate,
            'backgroundPath' => $backgroundPath
        ])
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'chroot' => [public_path(), storage_path()],
            ])
            ->setPaper([0, 0, 800, 1100], 'portrait');

        return $pdf->stream('certificate-' . $certificate->certificate_number . '-Portrait.pdf');
    }

    /**
     * Download both certificate templates as PDFs (triggers two downloads)
     */
    public function downloadBothPDFs($id)
    {
        $certificate = Certificate::findOrFail($id);

        // Return URLs for frontend to download both
        return Response::json([
            'template1_url' => route('certificate.download.template1', $id),
            'template2_url' => route('certificate.download.template2', $id),
        ], 200);
    }

    public function nextNumber()
    {
        $year = now()->year;
        $month = now()->format('m');

        $last = Certificate::withTrashed()
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->orderBy('id', 'DESC')
            ->first();

        $series = $last
            ? ((int) substr($last->certificate_number, -5)) + 1
            : 50001;

        return response()->json([
            'certificate_number' => $year . $month . $series
        ]);
    }
}
