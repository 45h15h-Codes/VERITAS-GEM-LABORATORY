<?php

namespace App\Http\Controllers;

use App\Models\CrmOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ExternalOrderController extends Controller
{
    /**
     * Receive transformed order data from CRM.
     * Uses updateOrCreate so re-sending the same order just updates it.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'crm_order_id' => 'required|integer',
            'certifier_name' => 'nullable|string|max:255',
            'type' => 'nullable|string|in:diamond,jewellery',
            'value' => 'nullable|numeric',
            'metal_purity' => 'nullable|string|max:100',
            'image_url' => 'nullable|url|max:2000',
            'order_date' => 'nullable|date',
            'title' => 'nullable|string',
            'item' => 'nullable|string',
            'diamond_color' => 'nullable|string|max:50',
            'diamond_clarity' => 'nullable|string|max:50',
            'diamond_weight' => 'nullable|numeric',
            'diamond_shape' => 'nullable|string|max:100',
            'diamond_cut' => 'nullable|string|max:100',
            'diamond_measurement' => 'nullable|string|max:100',
            'client_email' => 'nullable|string|max:255',    // Changed from 'email' — CRM may send masked/null
            'client_mobile' => 'nullable|string|max:50',
            'client_address' => 'nullable|string',
            'diamond_skus' => 'nullable|array',
            'company_name' => 'nullable|string|max:255',
            'special_notes' => 'nullable|string',
            'images' => 'nullable|array',
        ]);

        $crmOrder = CrmOrder::updateOrCreate(
            ['crm_order_id' => $validated['crm_order_id']],
            $validated
        );

        return Response::json([
            'message' => 'Order data received successfully',
            'id' => $crmOrder->id,
        ], 200);
    }

    /**
     * List unused CRM orders for VGL admin to import into certificate form.
     */
    public function index()
    {
        $orders = CrmOrder::where('is_used', false)
            ->orderByDesc('created_at')
            ->get();

        return Response::json($orders);
    }

    /**
     * Get single CRM order details.
     */
    public function show(CrmOrder $crmOrder)
    {
        return Response::json($crmOrder);
    }
}
