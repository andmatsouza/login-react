//import { TopContentButton } from "../TopContentButton";

export function TopContentAdm(props) {
  return (
    <div className="top-content-adm">
      <span className="title-content">{props.title}</span>
      {/*<div className="top-content-adm-right">
        <TopContentButton tolink={props.tolink} stilo={props.stilo}>{props.label}</TopContentButton>        
  </div>*/}
      {props.children}
    </div>
  );
}
