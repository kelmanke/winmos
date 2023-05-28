import { extendTheme } from '@chakra-ui/react'
import '@fontsource-variable/montserrat'

export const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        _focus: { boxShadow: 'none' }
      },
      variants: {
        solid: {
          color: 'white',
          bg: '#FF7F50',
          _hover: {
            bg: '#C0C0C0',
            color: 'black'
          }
        }
      }
    }
  },
  styles: {
    global: {
      'html, body': {
        color: 'gray.600',
        lineHeight: 'tall'
      }
    }
  },
  fonts: {
    body: 'Montserrat Variable'
  }
})
