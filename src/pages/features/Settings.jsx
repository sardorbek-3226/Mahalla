import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { HiOutlineSun, HiOutlineMoon, HiOutlineLanguage, HiOutlineBell, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

const Toggle = ({ on, onClick }) => (
  <button
    onClick={onClick}
    className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
  >
    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${on ? 'left-[1.4rem]' : 'left-0.5'}`} />
  </button>
);

const Row = ({ icon: Icon, title, desc, children }) => (
  <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-4 last:border-0 dark:border-gray-800">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800"><Icon className="h-5 w-5" /></span>
      <div>
        <p className="font-medium">{title}</p>
        {desc && <p className="text-sm text-gray-400">{desc}</p>}
      </div>
    </div>
    {children}
  </div>
);

const Settings = () => {
  const { isDark, toggle } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState('uz');
  const [pushOn, setPushOn] = useState(true);

  const onLogout = () => {
    logout();
    toast.success('Tizimdan chiqdingiz');
    navigate('/login');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Sozlamalar" subtitle="Ilova sozlamalarini boshqaring" />

      <Card className="p-6">
        <Row icon={isDark ? HiOutlineMoon : HiOutlineSun} title="Mavzu" desc={isDark ? 'Tungi rejim' : 'Kunduzgi rejim'}>
          <Toggle on={isDark} onClick={toggle} />
        </Row>
        <Row icon={HiOutlineLanguage} title="Til" desc="Interfeys tili">
          <select className="input-base h-9 w-32 py-0" value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="uz">O‘zbekcha</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </Row>
        <Row icon={HiOutlineBell} title="Push bildirishnomalar" desc="Yangi xabar va buyurtmalar">
          <Toggle on={pushOn} onClick={() => setPushOn((v) => !v)} />
        </Row>
      </Card>

      <Card className="mt-5 p-6">
        <h3 className="mb-2 font-semibold text-red-600">Hisobdan chiqish</h3>
        <p className="mb-4 text-sm text-gray-500">Joriy seansni tugatish.</p>
        <Button variant="danger" leftIcon={<HiOutlineArrowRightOnRectangle className="h-5 w-5" />} onClick={onLogout}>
          Chiqish
        </Button>
      </Card>
    </div>
  );
};

export default Settings;
