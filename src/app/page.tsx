import ImageGenerator from '@/components/ImageGenerator';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <ImageGenerator />
      </div>
    </div>
  );
}