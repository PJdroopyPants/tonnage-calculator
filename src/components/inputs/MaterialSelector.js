import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Text,
  Select,
  Skeleton,
  Flex,
  Badge,
  InputGroup,
  InputLeftElement,
  Tooltip,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon
} from '@chakra-ui/react';
import { SearchIcon, InfoIcon } from '@chakra-ui/icons';
import { fetchMaterials, setSelectedMaterial } from '../../store/materialsSlice';

const MaterialSelector = () => {
  const dispatch = useDispatch();
  const { items, selected, loading, error } = useSelector(state => state.materials);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  // Get unique categories from materials
  const categories = [...new Set(items.map(item => item.category))];
  
  // Filter materials based on search term and category
  const filteredMaterials = items.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? material.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  // Style variables based on color mode
  const badgeBg = useColorModeValue('blue.100', 'blue.800');
  const popoverBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Fetch materials on component mount
  useEffect(() => {
    if (items.length === 0 && !loading) {
      dispatch(fetchMaterials());
    }
  }, [dispatch, items, loading]);
  
  const handleChange = (e) => {
    const materialId = e.target.value;
    if (materialId) {
      const selectedMaterial = items.find(item => item.id === materialId);
      dispatch(setSelectedMaterial(selectedMaterial));
    } else {
      dispatch(setSelectedMaterial(null));
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
  };
  
  // Material info tooltip content
  const getMaterialInfo = (material) => {
    if (!material) return null;
    
    return (
      <Box>
        <Text fontWeight="bold">{material.name}</Text>
        <Text fontSize="sm">Category: {material.category}</Text>
        <Table size="sm" mt={2}>
          <Thead>
            <Tr>
              <Th px={2} py={1} fontSize="xs">Property</Th>
              <Th px={2} py={1} fontSize="xs">Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td px={2} py={1} fontSize="xs">Tensile Strength</Td>
              <Td px={2} py={1} fontSize="xs">{material.tensileStrength} MPa</Td>
            </Tr>
            <Tr>
              <Td px={2} py={1} fontSize="xs">Yield Strength</Td>
              <Td px={2} py={1} fontSize="xs">{material.yieldStrength} MPa</Td>
            </Tr>
            <Tr>
              <Td px={2} py={1} fontSize="xs">Shear Strength</Td>
              <Td px={2} py={1} fontSize="xs">{material.shearStrength} MPa</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    );
  };
  
  if (loading) {
    return (
      <Box mb={4} minW={["100%", "250px"]}>
        <FormControl>
          <FormLabel fontSize="sm">Material</FormLabel>
          <Skeleton height="40px" width="100%" />
        </FormControl>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box mb={4} minW={["100%", "250px"]}>
        <FormControl isInvalid>
          <FormLabel fontSize="sm">Material</FormLabel>
          <Text color="danger.500" fontSize="sm">Error: {error}</Text>
        </FormControl>
      </Box>
    );
  }
  
  return (
    <Box mb={4} minW={["100%", "350px"]}>
      <FormControl>
        <Flex align="center">
          <FormLabel fontSize="sm" mb={1}>Material</FormLabel>
          <Tooltip 
            label="Select the material to be formed. Material properties affect tonnage calculations." 
            placement="top"
          >
            <InfoIcon boxSize={3} color="gray.500" />
          </Tooltip>
        </Flex>
        
        {/* Search and filter bar */}
        {items.length > 5 && (
          <Flex mb={2} gap={2}>
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input 
                placeholder="Search materials..." 
                value={searchTerm} 
                onChange={handleSearchChange}
                borderColor={borderColor}
              />
            </InputGroup>
            
            <Select 
              size="sm" 
              placeholder="All categories" 
              value={filterCategory} 
              onChange={handleCategoryChange}
              maxW="150px"
              borderColor={borderColor}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </Flex>
        )}
        
        <Select 
          value={selected ? selected.id : ""}
          onChange={handleChange}
          disabled={items.length === 0}
          borderColor={borderColor}
        >
          <option value="">Select a material</option>
          
          {filteredMaterials.map(material => (
            <option key={material.id} value={material.id}>
              {material.name}
            </option>
          ))}
        </Select>
        
        {/* Show selected material details */}
        {selected && (
          <Flex mt={2} align="center" gap={2}>
            <Badge px={2} py={1} borderRadius="md" bg={badgeBg}>
              {selected.category}
            </Badge>
            
            <Popover placement="bottom" trigger="hover">
              <PopoverTrigger>
                <Text 
                  fontSize="sm" 
                  cursor="pointer" 
                  color="primary.500" 
                  textDecoration="underline"
                >
                  Material Properties
                </Text>
              </PopoverTrigger>
              <PopoverContent bg={popoverBg} borderColor={borderColor} width="300px">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader fontWeight="semibold">Material Properties</PopoverHeader>
                <PopoverBody>
                  {getMaterialInfo(selected)}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
        )}
        
        {/* Show filtered results count */}
        {searchTerm && (
          <Text fontSize="xs" mt={1} color="gray.500">
            Found {filteredMaterials.length} matching materials
          </Text>
        )}
      </FormControl>
    </Box>
  );
};

export default MaterialSelector; 