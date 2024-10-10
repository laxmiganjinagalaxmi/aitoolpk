import { UserButton } from "@clerk/nextjs";

const DashboardPage = () => {
    return ( 
      
        <div>
            <p>
                Dashboard
            </p>
            <UserButton />
        </div>
     );
}
 
export default DashboardPage;