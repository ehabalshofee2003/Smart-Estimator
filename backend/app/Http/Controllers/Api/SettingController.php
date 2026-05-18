<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingController extends Controller
{
    public function index()
    {
        // استخدام الـ Cache لتسريع جلب الإعدادات
        $rate = \Illuminate\Support\Facades\Cache::remember('hourly_rate', 3600, function () {
            return Setting::where('key', 'hourly_rate')->value('value') ?? 50;
        });
        
        return response()->json(['hourly_rate' => (float) $rate]);
    }

    public function update(Request $request)
    {
        $request->validate(['hourly_rate' => 'required|numeric|min:1']);
        Setting::updateOrCreate(['key' => 'hourly_rate'], ['value' => $request->hourly_rate]);
        
        // تحديث الـ Cache فوراً عند تغيير القيمة
        \Illuminate\Support\Facades\Cache::put('hourly_rate', $request->hourly_rate, 3600);

        return response()->json(['message' => 'تم تحديث الإعدادات بنجاح']);
    }
}