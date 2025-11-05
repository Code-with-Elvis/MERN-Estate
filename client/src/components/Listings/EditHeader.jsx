import { NavLink, useParams } from "react-router-dom";

const EditHeader = () => {
  const { slug } = useParams();
  return (
    <header className="edit__listing--header">
      <nav className="flex gap-6 mb-3 text-muted-foreground pb-4 text-sm border-b border-b-border">
        <NavLink to={`/listings/${slug}/edit-details`} end>
          Edit Details
        </NavLink>
        <NavLink to={`/listings/${slug}/edit-image`}>Edit Image</NavLink>
      </nav>
    </header>
  );
};
export default EditHeader;
