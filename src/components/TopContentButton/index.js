import { Link } from "react-router-dom";
export function TopContentButton(props) {
  return (     
<div className="top-content-adm-right">
<Link to={props.tolink}>
<button type="button" className={props.stilo}>
  {props.children}
</button>
</Link>{" "}
</div>
  );
}
