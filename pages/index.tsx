import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// DBのカラムにあわせた型情報
type List = {
  id: string;
  title: string;
  created_at: string;
};

const Home: NextPage = () => {
  const [list, setList] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // sampleテーブルから全カラムのデータをid順に取得
      // dataに入る型はそのままだとany[]となるため.from<T>で指定
      const { data, error } = await supabase
        .from<List>("sample")
        .select("*")
        .order("id");

      if (error) {
        throw error;
      }
      if (data) {
        setList(data);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // supabaseからデータを取得
    fetchData();

    // subscriptionを生成
    const subscription = supabase
      .from("sample")
      // .onの第一引数には'INSERT'や'UPDATE'などアクションを限定して指定することも可能
      .on("*", (payload) => {
        fetchData();
        console.log("Change received!", payload);
      })
      .subscribe();

    return () => {
      // アンマウント時にsubscriptionを解除
      if (subscription) {
        supabase.removeSubscription(subscription);
      }
    };
  }, []);

  if (loading) return <div>loading...</div>;
  if (!list.length) return <div>missing data...</div>;

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

export default Home;
