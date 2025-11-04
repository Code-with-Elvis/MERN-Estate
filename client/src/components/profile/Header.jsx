import { NavLink, useParams } from "react-router-dom";

const Header = () => {
  const { id } = useParams();
  return (
    <header className="profile__header">
      <nav className="flex gap-6 mb-3 text-muted-foreground pb-4 text-sm border-b border-b-border">
        <NavLink to={`/profile/${id}`} end>
          My Listings
        </NavLink>
        <NavLink to={`/profile/${id}/favorites`}>Favorites</NavLink>
      </nav>
    </header>
  );
};
export default Header;
