const Remain = (props: {mines: number, remain: number}) => {
  return (
    <div>
      {props.remain + "/" + props.mines}
    </div>
  );
};

export default Remain;