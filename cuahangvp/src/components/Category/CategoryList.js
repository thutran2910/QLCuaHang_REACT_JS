import React from 'react';
import API, { endpoints } from '../../configs/API'; // Đường dẫn mới sau khi di chuyển

const CategoryList = () => {

  const [category, setCategory] = React.useState([]);

  const loadCats = async () => {
    try {
      let res = await API.get(endpoints['category']);
      setCategory(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  React.useEffect(() => {
    loadCats();
  }, []);

  return (
    <div>
      <h1>Danh sách danh mục</h1>
      {category.length === 0 ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <ul>
          {category.map((category) => (
            <li key={category.id}>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;
