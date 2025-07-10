import axios from 'axios';
import React, { Component, createRef } from 'react';
import './App.css';
import { IoRestaurant } from "react-icons/io5";
import { IoIosCloseCircle } from 'react-icons/io';

export default class App extends Component {
  state = {
    foods: [],
    search: '',
    selectedMeal: null,
    showSelectedMeal: false,
    mealIndex: null,
  };

  searchRef = createRef();

  componentDidMount() {
    axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken')
      .then(data => this.setState({ foods: data.data.meals }))
      .catch(err => console.log(err));

    setTimeout(() => {
      this.searchRef.current.focus();
    }, 1000);
  }

  searchMeal = () => {
    axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${this.state.search}`)
      .then(data => this.setState({ foods: data.data.meals }))
      .catch(err => console.log(err));
    this.setState({ search: '' });
  };

  searchMealOnEnter = (e) => {
    if (e.key === 'Enter') {
      axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${this.state.search}`)
        .then(data => this.setState({ foods: data.data.meals }))
        .catch(err => console.log(err));
      this.setState({ search: '' });
    }
  };

  selectMeal = (num) => {
    this.setState({
      mealIndex: num,
      showSelectedMeal: true,
      selectedMeal: this.state.foods[num],
    });
  };

  render() {
    const { selectedMeal, foods, search, showSelectedMeal } = this.state;
    return (
      <div>
        <nav>
          <h1><IoRestaurant /> FoodTruck</h1>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
          <div>
            <input
              ref={this.searchRef}
              value={search}
              onKeyDown={this.searchMealOnEnter}
              onChange={(e) => this.setState({ search: e.target.value })}
              type="search"
              name="search"
              placeholder="Chicken"
              id=""
            />
            <button onClick={this.searchMeal} type="button">Search</button>
          </div>
        </nav>

        <div className="cards">
          {foods.length > 0 && foods.map((item, index) => (
            <div key={index} onClick={() => this.selectMeal(index)} className="card">
              <img src={item.strMealThumb} alt="" />
              <h3>Title: {item.strMeal}</h3>
              <div>
                <p><b>Category:</b> {item.strCategory}</p>
                <p><b>Area:</b> {item.strArea}</p>
              </div>
            </div>
          ))}
        </div>

        {showSelectedMeal && selectedMeal && (
          <div className="selected">
            <IoIosCloseCircle onClick={() => this.setState({ showSelectedMeal: false })} className="close" />
            <div className='instructions'>
              <h1>{selectedMeal.strMeal}</h1>
              <br />
              <p>{selectedMeal.strInstructions}</p>
            </div>
            <iframe
              width="900"
              height="506"
              src={`https://www.youtube.com/embed/${selectedMeal.strYoutube.slice(-11)}`}
              title={selectedMeal.strMeal}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    );
  }
}
