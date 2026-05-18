import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    ar: {
      translation: {
         reports: {
          title: 'التقارير',
          emptyState: 'لا توجد تقارير متاحة حالياً. قم بإنشاء تقدير جديد لتظهر التقارير هنا.',
          downloadPdf: 'تحميل PDF',
          viewDetails: 'عرض التفاصيل',
          projectInfo: 'معلومات المشروع',
          totalCost: 'التكلفة الإجمالية',
          method: 'طريقة التقدير',
          date: 'تاريخ الإنشاء'
        },
          projects: {
          title: 'المشاريع',
          newName: 'مشروع جديد'
        },
        landing: {
          nav: {
            features: 'المميزات',
            howItWorks: 'كيف يعمل',
            contact: 'تواصل معنا',
            login: 'تسجيل الدخول'
          },
          chat: {
          title: 'مساعد التقدير الذكي',
          calculateBtn: 'احسب التقدير',
          inputPlaceholder: 'اكتب رسالتك هنا...',
          processing: 'البوت يفكر...'
        },
          hero: {
            title1: 'قدّر مشروعك البرمجي',
            titleHighlight: 'بالذكاء الاصطناعي',
            subtitle: 'منصة ذكية تحادثك، تحلل متطلباتك، وتقدم تقديرات دقيقة للجهد والتكلفة والوقت باستخدام معايير FPA و UCP.',
            startBtn: 'ابدأ التقدير مجاناً',
            loginBtn: 'لدي حساب بالفعل'
          },
          features: {
            mainTitle: 'لماذا تختار منصتنا؟',
            ai: { title: 'محادثة ذكية', desc: 'بوت يفهم اللغة العربية ويوجهك خطوة بخطوة لجمع بيانات مشروعك بسهولة.' },
            fpa: { title: 'تحليل FPA دقيق', desc: 'حساب نقاط الوظائف المعدلة وغير المعدلة بأعلى معايير الدقة الرياضية.' },
            ucp: { title: 'تحليل UCP متقدم', desc: 'تقدير حالات الاستخدام مع العوامل التقنية والبيئية الشاملة.' },
            pdf: { title: 'تقارير PDF احترافية', desc: 'إنشاء تقارير مفصلة بتنسيق RTL عربي احترافي جاهزة للطباعة أو المشاركة.' }
          }
        },
        register: {
          title: 'سجل الآن',
          subtitle: 'أنشئ حسابك المجاني وابدأ بتقدير مشروعك',
          googleBtn: 'التسجيل باستخدام Google',
          or: 'أو سجل بالبريد الإلكتروني',
          firstName: 'الاسم الأول',
          lastName: 'اسم العائلة',
          email: 'البريد الإلكتروني',
          password: 'كلمة المرور',
          registerBtn: 'إنشاء الحساب',
          haveAccount: 'لديك حساب بالفعل؟',
          loginLink: 'تسجيل الدخول',
          rightTitle: 'منصة التقدير الذكي',
          rightDesc: 'نستخدم أحدث تقنيات الذكاء الاصطناعي لتحويل محادثاتك إلى تقديرات دقيقة وتقارير احترافية.'
        },
        dashboard: {
          title: 'لوحة التحكم',
          stats: {
            projects: 'المشاريع',
            estimations: 'التقديرات',
            revenue: 'الإيرادات',
            users: 'المستخدمين'
          },
          recentProjects: 'آخر المشاريع',
          emptyState: 'لا توجد مشاريع حالياً. ابدأ بتقدير مشروعك الأول!',
          startEstimation: 'ابدأ التقدير'
        },
        sidebar: {
          home: 'الرئيسية',
          newEstimation: 'تقدير جديد',
          projects: 'المشاريع',
          reports: 'التقارير',
          settings: 'الإعدادات',
          logout: 'تسجيل الخروج'
        }
      }
    }
  },
  lng: 'ar', // اللغة الافتراضية
  fallbackLng: 'ar',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;