import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import '../../styles/Home.scss';
import axios from 'axios';
import { ImStack, ImSearch } from 'react-icons/im';
import { GrClose } from 'react-icons/gr';
import { NotificationContainer, NotificationManager } from 'react-notifications';

//Estado para el uso del LazyLoading
const Pokemons = lazy(() => import('./Pokemons'));

const Home = () => {
	const [dataPokemon, setDataPokemon] = useState([]);
	let objectDetail = [];

	//Estado de espera al iniciar Pagina
	const [count, setCount] = useState(0);
	const Timer = () => {
		const timer = setTimeout(() => {
			setCount('Timeout called!');
		}, 1000);
		return () => clearTimeout(timer);
	};

	let num = 20;
	const [offset, setOffset] = useState(0);
	function MoreData() {
		setOffset(offset + num);
	}
	function LessData() {
		setOffset(offset - num);
	}

	const GetAllData = () => {
		axios
			.get(`https://pokeapi.co/api/v2/pokemon/?&limit=20&offset=${offset}`)
			.then((response) => {
				let imgurls = response.data.results.map((element) => {
					return element.url;
				});
				GetPokemon(imgurls, 'getAll');
			})
			.catch((error) => {
				console.log('Peticion no lograda', error);
			});
	};

	//Get del pokemon por el url de detalles
	const GetPokemon = (imgurls, actionType) => {
		if (actionType === 'getAll') {
			setDataPokemon([]);
			imgurls.forEach((element) => {
				axios.get(element).then((response) => {
					setDataPokemon((current) => [
						...current,
						{
							id: response.data.id,
							img: response.data.sprites.other['official-artwork'].front_default,
							name: response.data.name,
							types: response.data.types,
							height: response.data.height,
							weight: response.data.weight,
							abilities: response.data.abilities,
						},
					]);
				});
			});
			return;
		}
		//Data de los nombres
		if (actionType === 'name') {
			setDataPokemon([]);

			setDataPokemon((current) => [
				...current,
				{
					id: imgurls.id,
					img: imgurls.sprites.other['official-artwork'].front_default,
					name: imgurls.name,
					types: imgurls.types,
					height: imgurls.height,
					weight: imgurls.weight,
					abilities: imgurls.abilities,
				},
			]);
			return;
		}
		//Data de los tipos
		if (actionType === 'type') {
			setDataPokemon([]);
			imgurls.forEach((element) => {
				axios.get(element.pokemon.url).then((response) => {
					setDataPokemon((current) => [
						...current,
						{
							id: response.data.id,
							img: response.data.sprites.other['official-artwork'].front_default,
							name: response.data.name,
							types: response.data.types,
							height: response.data.height,
							weight: response.data.weight,
							abilities: response.data.abilities,
						},
					]);
				});
			});
			return;
		}
	};

	//Actualizacion de estado de busqueda por tipo
	const [Type, setType] = useState(null);
	const [Name, setName] = useState(null);

	// console.log('clg NAME', Name);

	const GetByName = (Name) => {
		console.log('NAME fun : GETBYNAME', Name);
		axios
			.get(`https://pokeapi.co/api/v2/pokemon/${Name}`)
			.then((response) => {
				let imgurls = response.data;
				GetPokemon(imgurls, 'name');
			})
			.catch((error) => {
				console.log('Peticion no lograda', error);
				alert('El nombre ingresado no existe');
			});
		Timer();
	};

	const GetByType = (Type) => {
		axios
			.get(`https://pokeapi.co/api/v2/type/${Type}`)
			.then((response) => {
				let imgurls = response.data.pokemon;
				GetPokemon(imgurls, 'type');
			})
			.catch((error) => {
				console.log('Peticion no lograda', error);
				alert('El tipo ingresado no existe');
			});
		Timer();
	};

	function handleSubmit(e) {
		e.preventDefault();

		if (Name && Type) {
			// alert('Ingrese una busqueda a la vez');
			NotificationManager.error('Ingresa una busqueda a la vez', 'ERROR', 3000);
			document.querySelector('#Name').value = '';
			setName('');
			document.querySelector('#Type').value = '';
			setType('');
			return;
		}
		if (Name) GetByName(Name);
		if (Type) GetByType(Type);
	}

	useEffect(() => {
		Timer();
	}, []);

	useEffect(() => {
		GetAllData();
	}, [offset]);

	return (
		<div>
			<NotificationContainer />

			{/* Si el estado de Pokemons fue actualizado y contiene 
			informacion se ejecuta el codigo */}
			<div className="ContainerHome">
				<button
					className="Logo"
					onClick={() => {
						window.location.reload(true);
					}}>
					<h1>U M B R A</h1> <br />
					<h2>3D.STUDIO</h2>
				</button>
				<div className="Container_NavBar">
					<form onSubmit={handleSubmit} className="NavBar">
						<div className="ContainerInput">
							<input placeholder="Tipo" name="Type" id="Type" onChange={(e) => setType(e.target.value.toLowerCase())} />
							<button
								className="BtnDelete"
								type={'button'}
								onClick={() => {
									document.querySelector('#Type').value = '';
									setType('');
								}}>
								<GrClose />
							</button>
						</div>
						<div className="ContainerInput">
							<input placeholder="Nombre" name="Name" id="Name" onChange={(e) => setName(e.target.value.toLowerCase())} />
							<button
								className="BtnDelete"
								type={'button'}
								onClick={() => {
									document.querySelector('#Name').value = '';
									setName('');
								}}>
								<GrClose />
							</button>
						</div>
						<button className="Btn_Search" type={'submit'}>
							<ImSearch />
						</button>
					</form>
				</div>

				<div className="ContainerBtnDesign">
					<button className="BtnDesign">
						<ImStack
							onClick={() => {
								const classContainerPokemon = document.querySelectorAll('.ContainerPokeImg');
								classContainerPokemon.forEach((element) => {
									element.classList.toggle('ContainerPokeImg2');
								});
							}}
						/>
					</button>
				</div>

				<div className="ContainerCardPokemon">
					<Suspense fallback={<h1>Cargando...</h1>}>{dataPokemon && <Pokemons data={dataPokemon} />}</Suspense>
				</div>

				<div className="ContainerFooter">
					{offset === 0 ? (
						<button
							className="BtnMore1"
							onClick={() => {
								MoreData();
							}}>
							Show More
						</button>
					) : (
						<div className="ContainerPagination">
							<button
								className="BtnMore2"
								onClick={() => {
									LessData();
								}}>
								Show Less
							</button>
							<button
								className="BtnMore2"
								onClick={() => {
									MoreData();
								}}>
								Show More
							</button>
						</div>
					)}
					<img alt="" src="https://res.cloudinary.com/aca-geek/image/upload/v1670039007/Imagen_de_WhatsApp_2022-12-02_a_las_22.43.17_yhrer4.jpg" className="ImgFooter" />
				</div>
			</div>
		</div>
	);
};

export default Home;
