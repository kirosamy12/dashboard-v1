export default function AdminCMS() {
  return (
    <div className="p-6 space-y-5">
      <h2 className="text-xl font-bold text-gray-900">إدارة المحتوى</h2>
      <div className="grid grid-cols-3 gap-4">
        {['البانرات الإعلانية', 'صفحة من نحن', 'الشروط والأحكام', 'سياسة الخصوصية', 'الإشعارات', 'الأسئلة الشائعة'].map(item => (
          <div key={item} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-gray-300 cursor-pointer transition">
            <p className="font-medium text-gray-800">{item}</p>
            <p className="text-xs text-gray-400 mt-1">تعديل المحتوى</p>
          </div>
        ))}
      </div>
    </div>
  )
}
