import React from "react";
import { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import axios  from 'axios';
import 'chart.js/auto'; 
const Chart = ()=>{
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setPosts(response.data);
    };
    fetchPosts();
  }, []);
  useEffect(() => {
    if (query) {
      const fetchFilteredPosts = async () => {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?title_like=${query}`);
        setFilteredPosts(response.data);
      };
      fetchFilteredPosts();
    } else {
      setFilteredPosts(posts);
    }
  }, [query, posts]);
  const getChartData = () => {
    const data = filteredPosts.reduce((acc, post) => {
      const userId = post.userId;
      const wordCount = post.body.split(' ').length;

      if (!acc[userId]) {
        acc[userId] = {'name': `User ${userId}`, 'count': 0 };
      }
      acc[userId].count += wordCount;

      return acc;
    }, {});
    const labels = Object.keys(data).map(key => `${key} - ${data[key].name}`);
    const counts = Object.values(data).map(item => item.count);
    return {
      labels,
      datasets: [
        {
          label: 'Количество слов',
          data: counts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  };
  return (
    <div>
      <h1>Статистика постов пользователей</h1>
      <input
        type="text"
        placeholder="Поиск по заголовкам"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Bar data={getChartData()} />
    </div>
  );
}
export default Chart
