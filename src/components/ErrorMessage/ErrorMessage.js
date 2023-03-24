import classes from './ErrorMessage.module.scss';

function ErrorMessage() {
  return (
    <section className={classes.error}>
      Server respone whith error.
    </section>
  );
}

export default ErrorMessage;
