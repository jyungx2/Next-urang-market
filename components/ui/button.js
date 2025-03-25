import Link from "next/link";
import classes from "./button.module.css";

function Button(props) {
  const combinedClassName = `${classes.btn} ${props.className || ""}`;

  if (props.link) {
    return (
      <Link href={props.link} className={combinedClassName}>
        {props.children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} onClick={props.onClick}>
      {props.children}
    </button>
  );
}

export default Button;
