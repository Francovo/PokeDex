import { Box, Button, Img, Modal, ModalBody, ModalContent, ModalOverlay, Table, Td, Th, Tr } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { GrClose } from 'react-icons/gr';

export const ModalDetails = ({ Pokemon, isOpen, onClose }) => {
	//Peticion a la URL de detalles
	const [description, setDescription] = useState(null);
	// eslint-disable-next-line no-lone-blocks
	useEffect(() => {
		Pokemon !== null ? (
			axios
				.get(`https://pokeapi.co/api/v2/characteristic/${Pokemon.id}`)
				.then((response) => {
					setDescription(response.data.descriptions);
				})
				.catch((error) => {
					console.log(error);
				})
		) : (
			<></>
		);

		if (onClose) {
			setDescription(null);
		}
	}, [Pokemon, onClose]);

	return (
		<>
			{Pokemon !== null ? (
				<Modal isOpen={isOpen} onClose={onClose} size="4xl">
					<ModalOverlay />
					<ModalContent bg="transparent" marginTop="10%">
						<ModalBody borderRadius="40px" display="flex" flexDirection="column" backgroundImage="linear-gradient(to right bottom, #e6136e, #dc5ea1, #cc8bc2, #c2aecf, #cbcbcb)">
							<Box display="flex" flexDirection={{ base: 'column', md: 'row' }} gap="2">
								<Box display="flex" justifyContent={{ base: 'center' }} flexDirection={{ base: 'column', sm: 'row' }}>
									<Button id="closeModal" onClick={onClose} width={{ base: '100px', sm: '70px' }} border="solid 1px" borderRadius="10px" marginTop="15px" background="none">
										<GrClose />
									</Button>
									<Img src={Pokemon.img} width={{ base: 'none', sm: 'none' }} />
								</Box>

								<Box width={{ base: '100%', dm: '40%' }} padding="10px" display="flex" flexDirection="column" alignItems="center">
									<Box fontWeight="bold" display="flex" fontSize="2xl" textTransform="uppercase">
										{Pokemon.id} - {Pokemon.name}
									</Box>
									<br />
									<Box fontWeight="500" fontSize="20px" color="white">
										SEED <br />
									</Box>
									<Box fontWeight="500" fontSize="20px" display="flex" gap="10%" flexDirection="row" width="fit-content">
										{Pokemon.types.map(({ slot, type }) => (
											<Box key={slot} textTransform="uppercase">
												{type.name}
											</Box>
										))}
									</Box>{' '}
									<br />
									<Box>
										HEIGHT - {Pokemon.height}" <br />
										WEIGHT - {Pokemon.weight} lbs.
									</Box>
									<br /> <br />
									<Table border="solid white">
										<tbody>
											<Tr>
												<Th colSpan="2" textAlign="center" fontSize="20px">
													ABILITIES
												</Th>
											</Tr>

											{Pokemon.abilities.map(({ is_hidden, ability }, index) =>
												is_hidden ? (
													<Tr fontWeight="bold" key={index}>
														<Td display="flex" justifyContent="center" color="#e6136e" border="none">
															Normal
														</Td>
														<Td color="blackAlpha.900">{ability.name}</Td>
													</Tr>
												) : (
													<Tr key={index} fontWeight="bold">
														<Td display="flex" justifyContent="center" color="#e6136e">
															Hidden
														</Td>
														<Td color="blackAlpha.900">{ability.name}</Td>
													</Tr>
												)
											)}
										</tbody>
									</Table>
									<>
										{description ? (
											<Box>
												{description.map((r, index) =>
													r.language.name === 'en' ? (
														<Box
															key={index}
															display="flex"
															flexDirection="column"
															color="white"
															borderRadius="15px"
															alignItems="center"
															marginTop="1rem"
															backgroundColor="#e6136e"
															padding=".5rem 4rem">
															<Box fontWeight="bold">DESCRIPTION</Box>
															<Box key={index}>{r.description}</Box>
														</Box>
													) : (
														<></>
													)
												)}
											</Box>
										) : (
											<></>
										)}
									</>
								</Box>
							</Box>
						</ModalBody>
					</ModalContent>
				</Modal>
			) : (
				<></>
			)}
		</>
	);
};
