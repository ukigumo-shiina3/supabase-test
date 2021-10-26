import { NextPage, GetServerSideProps } from "next";
import styles from "../../styles/Home.module.css";
import { supabase } from "../../lib/supabaseClient";

type List = {
  id: string;
  title: string;
  created_at: string;
};

type Props = {
  list?: List[];
  errors?: string;
};

const SgPage: NextPage<Props> = ({ list, errors }) => {
  if (errors) return <div>Error...</div>;
  if (!list?.length) return <div>missing data...</div>;

  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>TITLE</td>
            <td>CREATED_AT</td>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SgPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const id = context.params?.id as string;
    const { data } = await supabase
      .from<List>("sample")
      .select("*")
      .filter("id", "eq", id);

    return {
      props: {
        list: data,
      },
    };
  } catch (error: any) {
    return { props: { errors: error.message } };
  }
};
