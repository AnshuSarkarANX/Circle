import Bottombar from '@/components/ui/Shared/Bottombar'
import LeftSidebar from '@/components/ui/Shared/LeftSidebar'
import Topbar from '@/components/ui/Shared/Topbar'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <Topbar/>
      <LeftSidebar/>
      <section className='flex flex-1 h-full'>
        <Outlet/>
      </section>
      <Bottombar/>
    </div>
  )
}

export default RootLayout